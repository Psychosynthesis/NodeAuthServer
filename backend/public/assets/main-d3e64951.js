import{u as j,a as h,S as g,A as f,b as u}from"./auth-7c562d40.js";import{r as x,j as e,I as E,O as y,u as S,i as w,a as v,c as I,R as N,N as T}from"./libs-4d915eec.js";const i=()=>{window.location.replace("/login")},k=()=>{const o=j(),[r,s]=h(),{token:n}=r,p=()=>{o.logout().then(t=>{t.error===!1&&(s({type:"clearUserData"}),s({type:"setToken",load:""}),i())})};return x.useEffect(()=>{const t=+window.localStorage.getItem("session"),a=new Date().getTime();!t||a-t>g?i():o.updateToken().then(c=>{var d;c.error===!1?(window.localStorage.setItem("session",String(new Date().getTime())),s({type:"setToken",load:(d=c.data)==null?void 0:d.token})):i()})},[]),x.useEffect(()=>{n&&o.getUser().then(t=>{var a;t.error===!1?s({type:"setUserData",load:(a=t.data)==null?void 0:a.user}):(s({type:"clearUserData"}),s({type:"setToken",load:""}),i())})},[n]),e.jsxs("div",{className:"main-layout",children:[(r==null?void 0:r.user)&&e.jsxs("div",{className:"header-row",children:[e.jsxs("div",{children:["User: ",r.user.username]}),e.jsx("div",{children:e.jsx(E,{onClick:p,children:"Выйти"})})]}),e.jsx(y,{})]})},m=()=>(h(),e.jsx("div",{className:"list",children:e.jsx("h2",{style:{textAlign:"center"},children:"Example List"})}));const l=({isNoFound:o})=>{var n;if(o)return e.jsxs("div",{className:"error-page",children:[e.jsx("h1",{children:"404"}),e.jsx("p",{children:"Sorry, page no found."})]});const r=S();let s;return w(r)?s=((n=r.error)==null?void 0:n.message)||r.statusText:r instanceof Error?s=r.message:typeof r=="string"?s=r:s="Unknown error",console.error(r),e.jsxs("div",{className:"error-page",children:[e.jsx("h1",{children:"Oops!"}),e.jsx("p",{children:"Sorry, an unexpected error has occurred."}),e.jsx("p",{children:e.jsx("i",{children:s})})]})},R=document.getElementById("main-node"),A=v([{element:e.jsx(k,{}),errorElement:e.jsx(l,{}),children:[{path:"/",element:e.jsx(m,{})},{path:"/404",element:e.jsx(l,{isNoFound:!0})},{path:"/list",element:e.jsx(m,{})},{path:"*",element:e.jsx(T,{to:"/404",replace:!0})}]},{path:"/login",element:e.jsx(u,{}),errorElement:e.jsx(l,{})},{path:"/register",element:e.jsx(u,{}),errorElement:e.jsx(l,{})}]);I(R).render(e.jsx(f,{children:e.jsx(N,{router:A})}));
