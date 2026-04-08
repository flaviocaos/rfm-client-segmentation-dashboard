import { useState, useEffect, useRef } from "react";

const SEGS = {
  VIP:        { hex:"#7F77DD", bg:"#F4F3FD", tx:"#3C3489", emoji:"👑", desc:"Alta freq., alto valor, compra recente", churn: 0.05 },
  Leal:       { hex:"#1D9E75", bg:"#EBF8F3", tx:"#085041", emoji:"💚", desc:"Frequência média-alta, bom valor", churn: 0.15 },
  "Em Risco": { hex:"#EF9F27", bg:"#FEF6E7", tx:"#7A4A08", emoji:"⚠️", desc:"Foram bons, mas sumiram", churn: 0.55 },
  Inativo:    { hex:"#E24B4A", bg:"#FEF0F0", tx:"#7A1F1F", emoji:"💤", desc:"Baixa freq., baixo valor", churn: 0.80 },
  Novo:       { hex:"#378ADD", bg:"#EBF4FD", tx:"#0C447C", emoji:"🌱", desc:"Poucas compras, potencial alto", churn: 0.30 },
};
const SK = Object.keys(SEGS);
const fR = v => `R$ ${(v||0).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}`;
const fN = v => (v||0).toLocaleString("pt-BR");
const fK = v => v>=1000?`${(v/1000).toFixed(1)}k`:String(Math.round(v||0));

function genRows(n=150){
  const now=new Date("2024-12-31"),out=[];
  const profiles=[
    {recRange:[1,30],freqRange:[8,20],valRange:[2000,15000],weight:15},
    {recRange:[1,90],freqRange:[4,12],valRange:[800,5000],weight:25},
    {recRange:[90,200],freqRange:[3,8],valRange:[500,3000],weight:20},
    {recRange:[200,365],freqRange:[1,3],valRange:[50,500],weight:25},
    {recRange:[1,60],freqRange:[1,3],valRange:[100,1000],weight:15},
  ];
  const totalW=profiles.reduce((a,p)=>a+p.weight,0);
  for(let i=1;i<=n;i++){
    let rnd=Math.random()*totalW,prof=profiles[0];
    for(const p of profiles){rnd-=p.weight;if(rnd<=0){prof=p;break;}}
    const purchases=Math.floor(Math.random()*(prof.freqRange[1]-prof.freqRange[0]))+prof.freqRange[0];
    for(let j=0;j<purchases;j++){
      const d=Math.floor(Math.random()*(prof.recRange[1]-prof.recRange[0]))+prof.recRange[0];
      out.push({customer_id:`C${String(i).padStart(4,"0")}`,purchase_date:new Date(now-(d+Math.floor(Math.random()*60))*864e5).toISOString().slice(0,10),purchase_value:parseFloat((Math.random()*(prof.valRange[1]-prof.valRange[0])+prof.valRange[0]).toFixed(2))});
    }
  }
  return out;
}

function buildClients(rows,k=5){
  const map={},now=new Date("2024-12-31");
  rows.forEach(r=>{const id=r.customer_id,d=new Date(r.purchase_date);if(!map[id])map[id]={id,last:d,freq:0,mon:0};if(d>map[id].last)map[id].last=d;map[id].freq++;map[id].mon+=r.purchase_value;});
  let arr=Object.values(map).map(c=>({...c,rec:Math.floor((now-c.last)/864e5),mon:parseFloat(c.mon.toFixed(2))}));
  const nm=(a,key)=>{const vs=a.map(x=>x[key]),mn=Math.min(...vs),mx=Math.max(...vs);return a.map(x=>({...x,[key+"_n"]:mx===mn?.5:(x[key]-mn)/(mx-mn)}));};
  arr=nm(arr,"rec");arr=nm(arr,"freq");arr=nm(arr,"mon");
  arr=arr.map(c=>({...c,rn:1-c.rec_n,fn:c.freq_n,mn2:c.mon_n}));
  arr=nm(arr,"rn");arr=nm(arr,"fn");arr=nm(arr,"mn2");
  let cents=arr.slice(0,k).map(d=>({r:d.rn_n,f:d.fn_n,m:d.mn2_n})),asgn=arr.map(()=>0);
  for(let it=0;it<50;it++){
    asgn=arr.map(d=>{let b=0,bd=Infinity;cents.forEach((c,ci)=>{const dist=(d.rn_n-c.r)**2+(d.fn_n-c.f)**2+(d.mn2_n-c.m)**2;if(dist<bd){bd=dist;b=ci;}});return b;});
    cents=Array.from({length:k},(_,ci)=>{const pts=arr.filter((_,i)=>asgn[i]===ci);if(!pts.length)return cents[ci];return{r:pts.reduce((s,p)=>s+p.rn_n,0)/pts.length,f:pts.reduce((s,p)=>s+p.fn_n,0)/pts.length,m:pts.reduce((s,p)=>s+p.mn2_n,0)/pts.length};});
  }
  const sc=v=>v>=.75?5:v>=.5?4:v>=.35?3:v>=.2?2:1;
  const sg=(r,f,m)=>r>=4&&f>=4&&m>=4?"VIP":(r+f+m)/3>=3.5?"Leal":r<=2&&(f>=3||m>=3)?"Em Risco":f<=2&&m<=2?"Inativo":"Novo";
  return arr.map((c,i)=>{const rs=sc(c.rn_n),fs=sc(c.fn_n),ms=sc(c.mn2_n),seg=sg(rs,fs,ms);return{...c,cluster:asgn[i],rs,fs,ms,segment:seg,churnScore:parseFloat((SEGS[seg].churn+(Math.random()-.5)*.1).toFixed(2))};});
}

function parseCSV(txt){
  const lines=txt.trim().split("\n"),h=lines[0].split(",").map(x=>x.trim().toLowerCase().replace(/\s+/g,"_"));
  return lines.slice(1).map(l=>{const v=l.split(","),o={};h.forEach((k,i)=>o[k]=v[i]?.trim());o.purchase_value=parseFloat(o.purchase_value)||0;return o;}).filter(r=>r.customer_id&&r.purchase_date&&r.purchase_value>0);
}

function exportCSV(clients,segment){
  const data=segment==="Todos"?clients:clients.filter(c=>c.segment===segment);
  const hdr="customer_id,segment,recency_days,frequency,monetary,r_score,f_score,m_score,churn_score";
  const rows=data.map(c=>`${c.id},${c.segment},${c.rec},${c.freq},${c.mon.toFixed(2)},${c.rs},${c.fs},${c.ms},${c.churnScore}`);
  const blob=new Blob([[hdr,...rows].join("\n")],{type:"text/csv"});
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`rfm_${segment.replace(/\s/g,"_")}.csv`;a.click();
}

function ScoreBar({v,max=5}){
  return <div style={{display:"flex",gap:3}}>{Array.from({length:max}).map((_,i)=><div key={i} style={{width:13,height:5,borderRadius:3,background:i<v?(v>=4?"#1D9E75":v>=3?"#EF9F27":"#E24B4A"):"#e0e0e0"}}/>)}</div>;
}

function Tip({text}){
  const [show,setShow]=useState(false);
  return <span style={{position:"relative",display:"inline-flex"}} onMouseEnter={()=>setShow(true)} onMouseLeave={()=>setShow(false)}>
    <span style={{width:14,height:14,borderRadius:7,background:"#ddd",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#666",cursor:"help",marginLeft:4}}>?</span>
    {show&&<div style={{position:"absolute",bottom:"120%",left:"50%",transform:"translateX(-50%)",background:"#222",color:"#fff",fontSize:11,padding:"6px 10px",borderRadius:8,whiteSpace:"nowrap",zIndex:99,pointerEvents:"none"}}>{text}</div>}
  </span>;
}



function Scatter({data,filter,hovId,setHov}){
  const ref=useRef();
  useEffect(()=>{
    const cv=ref.current;if(!cv)return;
    const ctx=cv.getContext("2d"),W=cv.width,H=cv.height,P=44;
    ctx.clearRect(0,0,W,H);
    const pts=filter==="Todos"?data:data.filter(c=>c.segment===filter);
    if(!pts.length)return;
    const xs=pts.map(c=>c.rec),ys=pts.map(c=>c.mon),zM=Math.max(...pts.map(c=>c.freq));
    const xn=Math.min(...xs),xx=Math.max(...xs),yn=Math.min(...ys),yx=Math.max(...ys);
    const tx=v=>P+(v-xn)/(xx-xn||1)*(W-P*2),ty=v=>H-P-(v-yn)/(yx-yn||1)*(H-P*1.6);
    for(let i=0;i<=4;i++){ctx.strokeStyle="rgba(128,128,128,0.08)";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(P+i*(W-P*2)/4,P*.4);ctx.lineTo(P+i*(W-P*2)/4,H-P);ctx.stroke();ctx.beginPath();ctx.moveTo(P,P*.4+i*(H-P*1.6)/4);ctx.lineTo(W-P,P*.4+i*(H-P*1.6)/4);ctx.stroke();}
    ctx.fillStyle="rgba(120,120,120,0.45)";ctx.font="10px sans-serif";ctx.textAlign="center";
    ctx.fillText("← mais recente   Recência (dias)   mais antigo →",W/2,H-7);
    ctx.save();ctx.translate(13,H/2);ctx.rotate(-Math.PI/2);ctx.fillText("Valor gasto (R$)",0,0);ctx.restore();
    pts.forEach(c=>{
      const x=tx(c.rec),y=ty(c.mon),r=3+c.freq/zM*11,hov=c.id===hovId;
      ctx.beginPath();ctx.arc(x,y,hov?r+4:r,0,Math.PI*2);
      ctx.fillStyle=SEGS[c.segment].hex+(hov?"ff":"88");ctx.fill();
      if(hov){ctx.strokeStyle="#fff";ctx.lineWidth=2;ctx.stroke();}
    });
  },[data,filter,hovId]);
  const onMove=e=>{
    const cv=ref.current;if(!cv)return;
    const rect=cv.getBoundingClientRect(),mx=(e.clientX-rect.left)*(cv.width/rect.width),my=(e.clientY-rect.top)*(cv.height/rect.height);
    const pts=filter==="Todos"?data:data.filter(c=>c.segment===filter);
    const P=44,W=cv.width,H=cv.height;
    const xs=pts.map(c=>c.rec),ys=pts.map(c=>c.mon);
    const xn=Math.min(...xs),xx=Math.max(...xs),yn=Math.min(...ys),yx=Math.max(...ys);
    const tx=v=>P+(v-xn)/(xx-xn||1)*(W-P*2),ty=v=>H-P-(v-yn)/(yx-yn||1)*(H-P*1.6);
    let found=null,best=Infinity;
    pts.forEach(c=>{const dx=tx(c.rec)-mx,dy=ty(c.mon)-my,d=dx*dx+dy*dy;if(d<best&&d<600){best=d;found=c;}});
    setHov(found||null);
  };
  return <canvas ref={ref} width={700} height={290} style={{width:"100%",height:"auto",cursor:"crosshair",display:"block",borderRadius:8}} onMouseMove={onMove} onMouseLeave={()=>setHov(null)}/>;
}

function Heatmap({data}){
  const ref=useRef();
  useEffect(()=>{
    const cv=ref.current;if(!cv)return;
    const ctx=cv.getContext("2d"),W=cv.width,H=cv.height;
    const grid=Array.from({length:5},()=>Array(5).fill(0));
    data.forEach(c=>{const ri=Math.min(c.rs-1,4),fi=Math.min(c.fs-1,4);grid[4-fi][ri]++;});
    const maxV=Math.max(...grid.flat())||1;
    const cw=(W-60)/5,ch=(H-40)/5,px=50,py=10;
    grid.forEach((row,fi)=>row.forEach((v,ri)=>{
      const x=px+ri*cw,y=py+fi*ch,alpha=v/maxV;
      ctx.fillStyle=`rgba(127,119,221,${alpha*.85+.05})`;
      ctx.beginPath();ctx.roundRect(x+2,y+2,cw-4,ch-4,6);ctx.fill();
      if(v>0){ctx.fillStyle=alpha>.5?"#fff":"#3C3489";ctx.font=`${alpha>.3?"500 ":""}12px sans-serif`;ctx.textAlign="center";ctx.fillText(v,x+cw/2,y+ch/2+4);}
    }));
    ctx.fillStyle="rgba(120,120,120,0.6)";ctx.font="10px sans-serif";ctx.textAlign="center";
    for(let i=0;i<5;i++){ctx.fillText(`R${i+1}`,px+i*cw+cw/2,H-4);ctx.fillText(`F${5-i}`,32,py+i*ch+ch/2+4);}
  },[data]);
  return <canvas ref={ref} width={360} height={260} style={{width:"100%",maxWidth:360,height:"auto",display:"block"}}/>;
}

function Histogram({data,field,color}){
  const ref=useRef();
  useEffect(()=>{
    const cv=ref.current;if(!cv)return;
    const ctx=cv.getContext("2d"),W=cv.width,H=cv.height,P=32;
    ctx.clearRect(0,0,W,H);
    const vals=data.map(c=>c[field]);
    const mn=Math.min(...vals),mx=Math.max(...vals),bins=12;
    const bsize=(mx-mn)/bins,counts=Array(bins).fill(0);
    vals.forEach(v=>{const i=Math.min(Math.floor((v-mn)/bsize),bins-1);counts[i]++;});
    const maxC=Math.max(...counts)||1,bw=(W-P*2)/bins;
    counts.forEach((c,i)=>{
      const x=P+i*bw,bh=(c/maxC)*(H-P-16),by=H-P-bh;
      const grad=ctx.createLinearGradient(x,by,x,H-P);
      grad.addColorStop(0,color+"cc");grad.addColorStop(1,color+"44");
      ctx.fillStyle=grad;ctx.beginPath();ctx.roundRect(x+1,by,bw-2,bh,3);ctx.fill();
    });
    ctx.fillStyle="rgba(120,120,120,0.5)";ctx.font="9px sans-serif";ctx.textAlign="center";
    [0,.5,1].forEach(t=>{ctx.fillText(Math.round(mn+t*(mx-mn)),P+t*(W-P*2),H-4);});
  },[data,field,color]);
  return <canvas ref={ref} width={280} height={140} style={{width:"100%",height:"auto",display:"block"}}/>;
}

function Treemap({data}){
  const ref=useRef();
  useEffect(()=>{
    const cv=ref.current;if(!cv)return;
    const ctx=cv.getContext("2d"),W=cv.width,H=cv.height;
    ctx.clearRect(0,0,W,H);
    const revs=SK.map(s=>({s,v:data.filter(c=>c.segment===s).reduce((a,c)=>a+c.mon,0)})).filter(x=>x.v>0).sort((a,b)=>b.v-a.v);
    const total=revs.reduce((a,x)=>a+x.v,0);
    let x=0,y=0,w=W,h=H;
    revs.forEach((item,idx)=>{
      const remaining=revs.slice(idx+1).reduce((a,x2)=>a+x2.v,0);
      let rw,rh;
      if(w>=h){rw=idx<revs.length-1?Math.floor((item.v/(item.v+remaining))*w):w;rh=h;}
      else{rw=w;rh=idx<revs.length-1?Math.floor((item.v/(item.v+remaining))*h):h;}
      ctx.fillStyle=SEGS[item.s].hex+"cc";
      ctx.beginPath();ctx.roundRect(x+2,y+2,rw-4,rh-4,8);ctx.fill();
      if(rw>60&&rh>40){ctx.fillStyle="#fff";ctx.font="500 12px sans-serif";ctx.textAlign="center";ctx.fillText(`${SEGS[item.s].emoji} ${item.s}`,x+rw/2,y+rh/2-6);ctx.font="11px sans-serif";ctx.fillText(fK(item.v),x+rw/2,y+rh/2+10);}
      if(w>=h){x+=rw;w-=rw;}else{y+=rh;h-=rh;}
    });
  },[data]);
  return <canvas ref={ref} width={460} height={220} style={{width:"100%",height:"auto",display:"block",borderRadius:10}}/>;
}

export default function App(){
  const [clients,setClients]=useState([]);
  const [k,setK]=useState(5);
  const [filter,setFilter]=useState("Todos");
  const [tab,setTab]=useState("scatter");
  const [hov,setHov]=useState(null);
  const [metric,setMetric]=useState("clientes");
  const [sort,setSort]=useState({col:"mon",asc:false});
  const [page,setPage]=useState(0);
  const [cmpA,setCmpA]=useState("VIP");
  const [cmpB,setCmpB]=useState("Em Risco");
  const PAGE=10;

  useEffect(()=>{setClients(buildClients(genRows(150),k));},[k]);
  const handleFile=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{try{setClients(buildClients(parseCSV(ev.target.result),k));setPage(0);}catch{alert("Erro ao processar CSV.");}};r.readAsText(f);};

  const counts=Object.fromEntries(SK.map(s=>[s,clients.filter(c=>c.segment===s).length]));
  const revs=Object.fromEntries(SK.map(s=>[s,clients.filter(c=>c.segment===s).reduce((a,c)=>a+c.mon,0)]));
  const totalRev=clients.reduce((a,c)=>a+c.mon,0);
  const fil=filter==="Todos"?clients:clients.filter(c=>c.segment===filter);
  const srtd=[...fil].sort((a,b)=>sort.asc?a[sort.col]-b[sort.col]:b[sort.col]-a[sort.col]);
  const tPages=Math.ceil(srtd.length/PAGE),pageD=srtd.slice(page*PAGE,(page+1)*PAGE);
  const top10=[...clients].sort((a,b)=>b.mon-a.mon).slice(0,10);
  const cmpStat=(seg,key)=>{const pts=clients.filter(c=>c.segment===seg);return pts.length?pts.reduce((a,c)=>a+c[key],0)/pts.length:0;};

  const tabs=[["scatter","Dispersão"],["heatmap","Matriz RFM"],["hist","Distribuições"],["treemap","Treemap"],["top10","Top 10"],["compare","Comparar"],["table","Tabela"]];

  return(
    <div style={{fontFamily:"system-ui,sans-serif",padding:"1.5rem 1.25rem 3rem",maxWidth:940,margin:"0 auto",color:"#1a1a18"}}>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"2rem",flexWrap:"wrap",gap:12}}>
        <div>
          <div style={{fontSize:22,fontWeight:600}}>Segmentação de Clientes RFM</div>
          <div style={{fontSize:13,color:"#666",marginTop:4}}>{clients.length} clientes · {k} clusters · KMeans</div>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:"#666"}}>
            Clusters<Tip text="Número de grupos KMeans"/>
            <input type="range" min={3} max={7} value={k} step={1} onChange={e=>setK(Number(e.target.value))} style={{width:70}}/>
            <span style={{fontWeight:600,minWidth:12}}>{k}</span>
          </div>
          <button onClick={()=>exportCSV(clients,filter)} style={{fontSize:12,padding:"7px 14px",borderRadius:9,border:"1px solid #ddd",background:"#f5f5f5",cursor:"pointer"}}>↓ Exportar CSV</button>
          <label style={{fontSize:12,padding:"7px 14px",borderRadius:9,border:"1px solid #ddd",background:"#f5f5f5",cursor:"pointer"}}>
            ↑ Importar CSV<input type="file" accept=".csv" onChange={handleFile} style={{display:"none"}}/>
          </label>
        </div>
      </div>

      {/* KPIs */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(148px,1fr))",gap:12,marginBottom:"1.75rem"}}>
        {[
          {l:"Clientes",v:fN(clients.length),icon:"👥",tip:"Total de clientes únicos"},
          {l:"Receita total",v:fR(totalRev),icon:"💰",tip:"Soma de todas as compras"},
          {l:"Ticket médio",v:fR(clients.length?totalRev/clients.length:0),icon:"🎫",tip:"Receita dividida por clientes"},
          {l:"VIP",v:fN(counts.VIP||0),icon:"👑",color:SEGS.VIP.hex,bg:SEGS.VIP.bg,tip:"Alto R, F e M"},
          {l:"Em risco",v:fN(counts["Em Risco"]||0),icon:"⚠️",color:SEGS["Em Risco"].hex,bg:SEGS["Em Risco"].bg,tip:"Bons clientes com recência caindo"},
        ].map(kp=>(
          <div key={kp.l} style={{background:kp.bg||"#f8f8f8",borderRadius:14,padding:"14px 16px",border:`1px solid ${kp.color?kp.color+"33":"#eee"}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:18}}>{kp.icon}</div>
              <Tip text={kp.tip}/>
            </div>
            <div style={{fontSize:10,color:kp.color||"#999",fontWeight:600,marginTop:8,marginBottom:3,textTransform:"uppercase",letterSpacing:"0.5px"}}>{kp.l}</div>
            <div style={{fontSize:20,fontWeight:600,color:kp.color||"#1a1a18"}}>{kp.v}</div>
          </div>
        ))}
      </div>

      {/* Segment pills */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))",gap:8,marginBottom:"1.5rem"}}>
        {["Todos",...SK].map(s=>{
          const act=filter===s,seg=SEGS[s];
          return(
            <button key={s} onClick={()=>{setFilter(s);setPage(0);}} style={{padding:"10px 8px",borderRadius:12,cursor:"pointer",textAlign:"center",border:act?`2px solid ${seg?.hex||"#333"}`:"1px solid #ddd",background:act?(seg?.bg||"#eee"):"#fff",transition:"all .15s"}}>
              <div style={{fontSize:16,marginBottom:3}}>{seg?.emoji||"🔍"}</div>
              <div style={{fontSize:12,fontWeight:act?600:400,color:act?(seg?.tx||"#333"):"#666"}}>{s}</div>
              {seg&&<div style={{fontSize:10,color:act?seg.hex:"#aaa",marginTop:1}}>{counts[s]||0}</div>}
            </button>
          );
        })}
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:2,marginBottom:"1.25rem",background:"#f0f0f0",borderRadius:12,padding:4,flexWrap:"wrap"}}>
        {tabs.map(([id,lb])=>(
          <button key={id} onClick={()=>setTab(id)} style={{flex:1,minWidth:80,fontSize:12,padding:"7px 4px",borderRadius:9,border:"none",cursor:"pointer",fontWeight:tab===id?600:400,background:tab===id?"#fff":"transparent",color:tab===id?"#1a1a18":"#666",boxShadow:tab===id?"0 1px 4px rgba(0,0,0,0.1)":"none",transition:"all .15s"}}>
            {lb}
          </button>
        ))}
      </div>

      {/* Scatter */}
      {tab==="scatter"&&<div>
        <div style={{display:"flex",flexWrap:"wrap",gap:10,marginBottom:10,alignItems:"center"}}>
          <span style={{fontSize:12,color:"#666"}}>X = Recência · Y = Monetário · Tamanho = Frequência · passe o mouse para inspecionar</span>
          <div style={{marginLeft:"auto",display:"flex",gap:10,flexWrap:"wrap"}}>
            {SK.map(s=><span key={s} style={{fontSize:11,display:"flex",alignItems:"center",gap:4,color:"#666"}}><span style={{width:9,height:9,borderRadius:2,background:SEGS[s].hex,display:"inline-block"}}/>{s}</span>)}
          </div>
        </div>
        <div style={{background:"#f8f8f8",borderRadius:14,padding:14,border:"1px solid #eee"}}>
          <Scatter data={clients} filter={filter} hovId={hov?.id} setHov={setHov}/>
        </div>
        {hov&&<div style={{marginTop:12,padding:"14px 18px",borderRadius:14,background:"#fff",border:`2px solid ${SEGS[hov.segment].hex}44`,display:"flex",gap:18,alignItems:"center",flexWrap:"wrap"}}>
          <div style={{fontSize:28}}>{SEGS[hov.segment].emoji}</div>
          <div style={{flex:1,minWidth:180}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
              <span style={{fontWeight:600}}>{hov.id}</span>
              <span style={{fontSize:11,padding:"2px 10px",borderRadius:20,background:SEGS[hov.segment].bg,color:SEGS[hov.segment].tx,fontWeight:600}}>{hov.segment}</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
              {[["Recência",`${hov.rec} dias`],["Frequência",`${hov.freq}x`],["Monetário",fR(hov.mon)]].map(([l,v])=>(
                <div key={l}><div style={{fontSize:10,color:"#999",marginBottom:2}}>{l}</div><div style={{fontSize:13,fontWeight:600}}>{v}</div></div>
              ))}
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {[["R",hov.rs],["F",hov.fs],["M",hov.ms]].map(([l,v])=>(
              <div key={l} style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:11,color:"#666",width:12}}>{l}</span><ScoreBar v={v}/><span style={{fontSize:11,fontWeight:600}}>{v}</span></div>
            ))}
            <div style={{fontSize:11,color:SEGS[hov.segment].tx,marginTop:2}}>Churn: {(hov.churnScore*100).toFixed(0)}%</div>
          </div>
        </div>}
      </div>}

      {/* Heatmap */}
      {tab==="heatmap"&&<div>
        <div style={{fontSize:12,color:"#666",marginBottom:12}}>Densidade de clientes por score de Recência (R) × Frequência (F). Cor mais intensa = mais clientes.</div>
        <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
          <div style={{background:"#f8f8f8",borderRadius:14,padding:16,border:"1px solid #eee",flex:"1 1 300px"}}>
            <Heatmap data={fil}/>
          </div>
          <div style={{flex:"1 1 220px",display:"flex",flexDirection:"column",gap:10}}>
            {SK.map(s=>{const churn=SEGS[s].churn;return(
              <div key={s} style={{background:"#f8f8f8",borderRadius:12,padding:"10px 14px",border:`1px solid ${SEGS[s].hex}33`}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:12,fontWeight:600,color:SEGS[s].tx}}>{SEGS[s].emoji} {s}</span>
                  <span style={{fontSize:11,color:"#aaa"}}>{counts[s]||0} clientes</span>
                </div>
                <div style={{fontSize:11,color:"#666",marginBottom:6}}>{SEGS[s].desc}</div>
                <div style={{display:"flex",alignItems:"center",gap:6,fontSize:11}}>
                  <span style={{color:"#aaa"}}>Risco churn:</span>
                  <div style={{flex:1,height:5,borderRadius:3,background:"#e0e0e0",overflow:"hidden"}}>
                    <div style={{width:`${churn*100}%`,height:"100%",background:churn>.5?"#E24B4A":churn>.3?"#EF9F27":"#1D9E75",borderRadius:3}}/>
                  </div>
                  <span style={{fontWeight:600,color:churn>.5?"#E24B4A":churn>.3?"#EF9F27":"#1D9E75"}}>{(churn*100).toFixed(0)}%</span>
                </div>
              </div>
            );})}
          </div>
        </div>
      </div>}

      {/* Histogramas */}
      {tab==="hist"&&<div>
        <div style={{fontSize:12,color:"#666",marginBottom:12}}>Distribuição estatística de cada dimensão RFM ({fil.length} clientes selecionados).</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:12}}>
          {[["rec","Recência (dias)","#7F77DD"],["freq","Frequência (compras)","#1D9E75"],["mon","Monetário (R$)","#378ADD"]].map(([f,lb,col])=>(
            <div key={f} style={{background:"#f8f8f8",borderRadius:14,padding:"14px 16px",border:"1px solid #eee"}}>
              <div style={{fontSize:12,fontWeight:600,marginBottom:10}}>{lb}</div>
              <Histogram data={fil} field={f} color={col}/>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#aaa",marginTop:8}}>
                <span>Média: {f==="mon"?fK(fil.reduce((a,c)=>a+c[f],0)/(fil.length||1)):Math.round(fil.reduce((a,c)=>a+c[f],0)/(fil.length||1))}</span>
                <span>Máx: {f==="mon"?fK(Math.max(...fil.map(c=>c[f]))):Math.max(...fil.map(c=>c[f]))}</span>
              </div>
            </div>
          ))}
        </div>
      </div>}

      {/* Treemap */}
      {tab==="treemap"&&<div>
        <div style={{fontSize:12,color:"#666",marginBottom:12}}>Área proporcional à receita de cada segmento.</div>
        <div style={{background:"#f8f8f8",borderRadius:14,padding:14,border:"1px solid #eee",marginBottom:16}}>
          <Treemap data={clients}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:10}}>
          {SK.map(s=>{const rev=revs[s]||0,pct=totalRev?rev/totalRev*100:0;return(
            <div key={s} style={{background:"#f8f8f8",borderRadius:12,padding:"12px 14px",border:`1px solid ${SEGS[s].hex}33`}}>
              <div style={{fontSize:12,fontWeight:600,color:SEGS[s].tx,marginBottom:4}}>{SEGS[s].emoji} {s}</div>
              <div style={{fontSize:16,fontWeight:600}}>{fK(rev)}</div>
              <div style={{fontSize:11,color:"#aaa",marginTop:2}}>{pct.toFixed(1)}% da receita</div>
              <div style={{height:4,borderRadius:2,background:"#e0e0e0",marginTop:8,overflow:"hidden"}}>
                <div style={{width:`${pct}%`,height:"100%",background:SEGS[s].hex,borderRadius:2}}/>
              </div>
            </div>
          );})}
        </div>
      </div>}

      {/* Top 10 */}
      {tab==="top10"&&<div>
        <div style={{fontSize:12,color:"#666",marginBottom:12}}>Os 10 clientes com maior valor monetário total.</div>
        <div style={{borderRadius:14,overflow:"hidden",border:"1px solid #eee"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead><tr style={{background:"#f5f5f5"}}>
              {["#","Cliente","Segmento","Recência","Compras","Valor total","Churn","R F M"].map(h=>(
                <th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:11,fontWeight:600,color:"#666",whiteSpace:"nowrap",borderBottom:"1px solid #eee"}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {top10.map((c,i)=>(
                <tr key={c.id} style={{borderBottom:"1px solid #f0f0f0",background:i%2?"#fafafa":"#fff"}}>
                  <td style={{padding:"10px 14px",fontWeight:600,color:"#aaa"}}>{i+1}</td>
                  <td style={{padding:"10px 14px",fontFamily:"monospace",fontSize:11}}>{c.id}</td>
                  <td style={{padding:"10px 14px"}}><span style={{fontSize:11,padding:"2px 8px",borderRadius:20,background:SEGS[c.segment].bg,color:SEGS[c.segment].tx,fontWeight:600}}>{SEGS[c.segment].emoji} {c.segment}</span></td>
                  <td style={{padding:"10px 14px"}}>{c.rec}d</td>
                  <td style={{padding:"10px 14px"}}>{c.freq}x</td>
                  <td style={{padding:"10px 14px",fontWeight:600}}>{fR(c.mon)}</td>
                  <td style={{padding:"10px 14px"}}><span style={{fontSize:11,fontWeight:600,color:c.churnScore>.5?"#E24B4A":c.churnScore>.3?"#EF9F27":"#1D9E75"}}>{(c.churnScore*100).toFixed(0)}%</span></td>
                  <td style={{padding:"10px 14px"}}><div style={{display:"flex",flexDirection:"column",gap:3}}><ScoreBar v={c.rs}/><ScoreBar v={c.fs}/><ScoreBar v={c.ms}/></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>}

      {/* Comparar */}
      {tab==="compare"&&<div>
        <div style={{display:"flex",gap:12,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
          <span style={{fontSize:13,color:"#666"}}>Comparar:</span>
          {[cmpA,cmpB].map((val,idx)=>(
            <select key={idx} value={val} onChange={e=>idx===0?setCmpA(e.target.value):setCmpB(e.target.value)} style={{fontSize:13,padding:"6px 10px",borderRadius:9,border:"1px solid #ddd",background:"#f5f5f5"}}>
              {SK.map(s=><option key={s} value={s}>{SEGS[s].emoji} {s}</option>)}
            </select>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {[cmpA,cmpB].map(seg=>{
            const cnt=counts[seg]||0,rev=revs[seg]||0;
            return(
              <div key={seg} style={{background:SEGS[seg].bg,borderRadius:14,padding:"18px 20px",border:`2px solid ${SEGS[seg].hex}55`}}>
                <div style={{fontSize:22,marginBottom:4}}>{SEGS[seg].emoji}</div>
                <div style={{fontSize:16,fontWeight:600,color:SEGS[seg].tx,marginBottom:12}}>{seg}</div>
                {[["Clientes",fN(cnt)],["Receita total",fR(rev)],["Ticket médio",cnt?fR(rev/cnt):"-"],["Recência média",`${Math.round(cmpStat(seg,"rec"))} dias`],["Freq. média",`${cmpStat(seg,"freq").toFixed(1)}x`],["Score R médio",cmpStat(seg,"rs").toFixed(1)],["Score F médio",cmpStat(seg,"fs").toFixed(1)],["Score M médio",cmpStat(seg,"ms").toFixed(1)],["Risco churn",`${(SEGS[seg].churn*100).toFixed(0)}%`]].map(([l,v])=>(
                  <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${SEGS[seg].hex}22`,fontSize:13}}>
                    <span style={{color:SEGS[seg].tx,opacity:.8}}>{l}</span>
                    <span style={{fontWeight:600,color:SEGS[seg].tx}}>{v}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>}

      {/* Tabela */}
      {tab==="table"&&<div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,flexWrap:"wrap",gap:8}}>
          <span style={{fontSize:12,color:"#666"}}>{fil.length} clientes · clique no cabeçalho para ordenar</span>
          <button onClick={()=>exportCSV(clients,filter)} style={{fontSize:12,padding:"5px 12px",borderRadius:8,border:"1px solid #ddd",background:"transparent",cursor:"pointer"}}>↓ Exportar seleção</button>
        </div>
        <div style={{borderRadius:14,overflow:"hidden",border:"1px solid #eee"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead><tr style={{background:"#f5f5f5"}}>
              {[["id","Cliente"],["segment","Segmento"],["rec","Recência"],["freq","Compras"],["mon","Valor"],["churnScore","Churn"],["rs","R"],["fs","F"],["ms","M"]].map(([col,lb])=>(
                <th key={col} onClick={()=>{if(col==="segment")return;setSort(s=>({col,asc:s.col===col?!s.asc:false}));setPage(0);}} style={{padding:"10px 12px",textAlign:"left",fontSize:11,fontWeight:600,color:"#666",cursor:col!=="segment"?"pointer":"default",whiteSpace:"nowrap",userSelect:"none",borderBottom:"1px solid #eee",background:sort.col===col?"#ececec":"transparent"}}>
                  {lb}{sort.col===col?(sort.asc?" ↑":" ↓"):""}
                </th>
              ))}
            </tr></thead>
            <tbody>
              {pageD.map((c,i)=>(
                <tr key={c.id} style={{borderBottom:"1px solid #f0f0f0",background:i%2?"#fafafa":"#fff"}}>
                  <td style={{padding:"9px 12px",fontFamily:"monospace",fontSize:11,color:"#888"}}>{c.id}</td>
                  <td style={{padding:"9px 12px"}}><span style={{fontSize:11,padding:"2px 8px",borderRadius:20,background:SEGS[c.segment].bg,color:SEGS[c.segment].tx,fontWeight:600}}>{SEGS[c.segment].emoji} {c.segment}</span></td>
                  <td style={{padding:"9px 12px"}}>{c.rec}d</td>
                  <td style={{padding:"9px 12px"}}>{c.freq}x</td>
                  <td style={{padding:"9px 12px",fontWeight:600}}>{fR(c.mon)}</td>
                  <td style={{padding:"9px 12px"}}><span style={{fontSize:11,fontWeight:600,color:c.churnScore>.5?"#E24B4A":c.churnScore>.3?"#EF9F27":"#1D9E75"}}>{(c.churnScore*100).toFixed(0)}%</span></td>
                  <td style={{padding:"9px 12px"}}><ScoreBar v={c.rs}/></td>
                  <td style={{padding:"9px 12px"}}><ScoreBar v={c.fs}/></td>
                  <td style={{padding:"9px 12px"}}><ScoreBar v={c.ms}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:12,fontSize:12,color:"#666"}}>
          <span>Página {page+1} de {tPages||1}</span>
          <div style={{display:"flex",gap:8}}>
            {["Anterior","Próxima"].map((lb,di)=>{const dis=di===0?page===0:page>=tPages-1;return <button key={lb} onClick={()=>setPage(p=>di===0?Math.max(0,p-1):Math.min(tPages-1,p+1))} disabled={dis} style={{padding:"6px 14px",border:"1px solid #ddd",borderRadius:8,background:"transparent",cursor:dis?"not-allowed":"pointer",opacity:dis?.4:1,fontSize:12}}>{lb}</button>;})}
          </div>
        </div>
      </div>}

      <div style={{marginTop:"2rem",fontSize:11,color:"#aaa",borderTop:"1px solid #eee",paddingTop:12}}>
        CSV esperado: <code style={{fontFamily:"monospace"}}>customer_id, purchase_date, purchase_value</code>
      </div>
    </div>
  );
}