import { useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  increment,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { db, storage } from '../firebase';
import type { Prenda } from '../types';

const COLECCION = 'prendas';

/** Suscripción en tiempo real a las prendas del usuario logueado */
export function useWardrobe(uid: string | undefined) {
  const [prendas, setPrendas] = useState<Prenda[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setPrendas([]);
      setLoading(false);
      return;
    }
    const q = query(collection(db, COLECCION), where('uid', '==', uid));
    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Prenda);
      items.sort((a, b) => b.creadoEn - a.creadoEn);
      setPrendas(items);
      setLoading(false);
    });
    return unsub;
  }, [uid]);

  return { prendas, loading };
}

/** Sube la foto a Storage y crea el documento de la prenda en Firestore */
export async function agregarPrenda(
  uid: string,
  datos: Omit<Prenda, 'id' | 'uid' | 'fotoUrl' | 'creadoEn' | 'usos' | 'ultimoUso'>,
  foto: File,
) {
  const rutaFoto = `prendas/${uid}/${Date.now()}_${foto.name}`;
  const storageRef = ref(storage, rutaFoto);
  await uploadBytes(storageRef, foto);
  const fotoUrl = await getDownloadURL(storageRef);

  // Firestore no acepta valores `undefined` (ej: precio no cargado) — los sacamos.
  const datosLimpios = Object.fromEntries(
    Object.entries(datos).filter(([, v]) => v !== undefined),
  );

  await addDoc(collection(db, COLECCION), {
    ...datosLimpios,
    uid,
    fotoUrl,
    creadoEn: Date.now(),
    usos: 0,
  });
}

/** Suma 1 al contador de usos y actualiza la fecha de último uso (botón "usé esto hoy") */
export async function marcarUso(prenda: Prenda) {
  await updateDoc(doc(db, COLECCION, prenda.id), {
    usos: increment(1),
    ultimoUso: Date.now(),
  });
}

export async function eliminarPrenda(prenda: Prenda) {
  await deleteDoc(doc(db, COLECCION, prenda.id));
  try {
    // best-effort: si la URL no matchea la ruta esperada, no rompe el flujo
    const rutaFoto = decodeURIComponent(
      new URL(prenda.fotoUrl).pathname.split('/o/')[1]?.split('?')[0] ?? '',
    );
    if (rutaFoto) await deleteObject(ref(storage, rutaFoto));
  } catch {
    // ignoramos errores al borrar la foto huérfana
  }
}
