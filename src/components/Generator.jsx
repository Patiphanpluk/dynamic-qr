import React, { useRef, useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { nanoid } from "nanoid";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function Generator(){
  const [target, setTarget] = useState("");
  const [fg, setFg] = useState("#0f172a");
  const [logoUrl, setLogoUrl] = useState("");
  const [dynamicLink, setDynamicLink] = useState("");
  const [creating, setCreating] = useState(false);

  const canvasRef = useRef(null);

  // after render, overlay logo onto canvas if provided
  useEffect(()=>{
    if(!logoUrl) return;
    const canvas = canvasRef.current?.querySelector("canvas");
    if(!canvas) return;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const size = Math.min(64, canvas.width * 0.22);
      ctx.drawImage(img, (canvas.width-size)/2, (canvas.height-size)/2, size, size);
    };
    img.src = logoUrl;
  }, [logoUrl, dynamicLink, fg, target]);

  // create dynamic entry in Firestore and produce short link
  const createDynamic = async () => {
    if(!target) return alert("กรุณาใส่ URL หรือข้อความปลายทาง");
    try{
      setCreating(true);
      const id = nanoid(7);
      const docRef = await addDoc(collection(db,"qr_links"), {
        id,
        targetUrl: target,
        scans: 0,
        createdAt: new Date()
      });
      // link uses hash router route /r/:id
      const link = `${window.location.origin}${window.location.pathname}#/r/${docRef.id}`;
      setDynamicLink(link);
    }catch(e){
      console.error(e);
      alert("เกิดข้อผิดพลาด ขอลองใหม่");
    }finally{
      setCreating(false);
    }
  };

  const download = () => {
    const canvas = canvasRef.current?.querySelector("canvas");
    if(!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "qr.png";
    a.click();
  };

  return (
    <div className="card">
      <div className="header">
        <div className="brand">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="6" fill="#eef2ff"/><path d="M7 12h10M7 16h10M7 8h10" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round"/></svg>
          <h1>QR Creator</h1>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:13,color:"#475569"}}>Dynamic QR & Analytics</div>
          <div style={{fontSize:12,color:"#94a3b8"}}>ใช้งานกับ Firebase</div>
        </div>
      </div>

      <div className="left">
        <label>ปลายทาง (URL หรือข้อความ)</label>
        <input className="input" type="text" placeholder="เช่น https://example.com" value={target} onChange={e=>setTarget(e.target.value)} />

        <label>สี QR</label>
        <input className="input" type="color" value={fg} onChange={e=>setFg(e.target.value)} />

        <label>โลโก้ (URL)</label>
        <input className="input" type="text" placeholder="https://..." value={logoUrl} onChange={e=>setLogoUrl(e.target.value)} />

        <div className="actions">
          <button className="btn" onClick={()=>{ /* re-render QR */ setDynamicLink(""); }}>อัปเดตตัวอย่าง</button>
          <button className="btn" onClick={download}>ดาวน์โหลด</button>
          <button className="btn" onClick={createDynamic} disabled={creating}>{creating? "กำลังบันทึก...":"บันทึกเป็น Dynamic QR"}</button>
        </div>

        {dynamicLink && (
          <div style={{marginTop:12}}>
            <div className="small">ลิงก์ Dynamic (เก็บสถิติได้)</div>
            <div className="resultLink"><a href={dynamicLink} target="_blank" rel="noreferrer">{dynamicLink}</a></div>
          </div>
        )}

        <footer>© {new Date().getFullYear()} โดยคุณปลั๊ก</footer>
      </div>

      <div className="right">
        <div className="preview" ref={canvasRef}>
          <QRCodeCanvas id="qr-preview" value={dynamicLink || target || " "} size={280} bgColor="#ffffff" fgColor={fg} includeMargin={false} />
        </div>
        <div className="small">ตัวอย่าง QR — ใส่โลโก้โดยใส่ URL ด้านบน หรือดาวน์โหลดไปใช้งาน</div>
      </div>
    </div>
  );
}
