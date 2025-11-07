import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase";

export default function Redirect(){
  const { id } = useParams();

  useEffect(()=>{
    (async ()=>{
      try{
        // find document by Firestore auto-id where we saved (we used addDoc, so id = doc.id)
        const ref = doc(db, "qr_links", id);
        const snap = await getDoc(ref);
        if(!snap.exists()){
          // not found: show message
          document.body.innerHTML = `<div style="display:flex;min-height:100vh;align-items:center;justify-content:center"><div style="max-width:520px;background:#fff;padding:22px;border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,0.08);text-align:center"><h3>ไม่พบ QR</h3><p>ลิงก์ไม่ถูกต้องหรือถูกลบ</p></div></div>`;
          return;
        }
        const data = snap.data();
        // increment scans
        await updateDoc(ref, { scans: increment(1) });
        // redirect
        const target = data.targetUrl || "/";
        window.location.href = target;
      }catch(e){
        console.error(e);
        document.body.innerHTML = `<div style="display:flex;min-height:100vh;align-items:center;justify-content:center"><div style="max-width:520px;background:#fff;padding:22px;border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,0.08);text-align:center"><h3>เกิดข้อผิดพลาด</h3><p>ลองเปิดลิงก์อีกครั้ง</p></div></div>`;
      }
    })();
  },[id]);

  return <div style={{padding:24,textAlign:"center"}}>กำลังเปลี่ยนเส้นทาง...</div>;
}
