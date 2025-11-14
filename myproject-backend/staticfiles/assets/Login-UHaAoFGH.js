import{t as e}from"./circle-alert-Cxk7sG2o.js";import{t}from"./lock-cY2fOLu_.js";import{t as n}from"./mail-BvPgBktG.js";import{_ as r,f as i,g as a,m as o,s,u as c,v as l}from"./index-Diqx_Gvz.js";var u=l(r()),d=l(i()),f=`http://localhost:8000/api`;function p(){let r=a(),[i,l]=(0,u.useState)({email:``,password:``}),[p,m]=(0,u.useState)(``),[h,g]=(0,u.useState)(!1);(0,u.useEffect)(()=>{console.log(`Login component mounted`);let e=document.createElement(`style`);return e.textContent=`
      .auth-container {
        min-height: 100vh !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        padding: 2rem !important;
      }
      .auth-card {
        background: white !important;
        border-radius: 20px !important;
        padding: 3rem !important;
        max-width: 480px !important;
        width: 100% !important;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3) !important;
        animation: slideUp 0.5s ease-out !important;
      }
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .auth-header {
        text-align: center !important;
        margin-bottom: 2.5rem !important;
      }
      .auth-icon {
        color: #667eea !important;
        margin-bottom: 1rem !important;
      }
      .auth-header h1 {
        font-size: 2rem !important;
        color: #1a202c !important;
        margin-bottom: 0.5rem !important;
        font-weight: 700 !important;
      }
      .auth-header p {
        color: #718096 !important;
        font-size: 1rem !important;
      }
      .error-message {
        display: flex !important;
        align-items: center !important;
        gap: 0.75rem !important;
        background: #fee !important;
        color: #c53030 !important;
        padding: 1rem !important;
        border-radius: 10px !important;
        margin-bottom: 1.5rem !important;
        border-left: 4px solid #c53030 !important;
      }
      .auth-form {
        display: flex !important;
        flex-direction: column !important;
        gap: 1.5rem !important;
      }
      .form-group {
        display: flex !important;
        flex-direction: column !important;
        gap: 0.5rem !important;
      }
      .form-group label {
        display: flex !important;
        align-items: center !important;
        gap: 0.5rem !important;
        font-weight: 600 !important;
        color: #2d3748 !important;
        font-size: 0.9rem !important;
      }
      .form-group label svg {
        color: #667eea !important;
      }
      .form-group input {
        padding: 0.9rem 1rem !important;
        border: 2px solid #e2e8f0 !important;
        border-radius: 10px !important;
        font-size: 1rem !important;
        transition: all 0.3s ease !important;
        outline: none !important;
      }
      .form-group input:focus {
        border-color: #667eea !important;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
      }
      .form-options {
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
        margin: -0.5rem 0 0.5rem 0 !important;
      }
      .checkbox-label {
        display: flex !important;
        align-items: center !important;
        gap: 0.5rem !important;
        cursor: pointer !important;
        color: #4a5568 !important;
        font-size: 0.9rem !important;
      }
      .forgot-link {
        color: #667eea !important;
        text-decoration: none !important;
        font-size: 0.9rem !important;
        font-weight: 500 !important;
      }
      .forgot-link:hover {
        color: #764ba2 !important;
        text-decoration: underline !important;
      }
      .btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        color: white !important;
        padding: 1rem !important;
        border: none !important;
        border-radius: 10px !important;
        font-size: 1rem !important;
        font-weight: 600 !important;
        cursor: pointer !important;
        transition: all 0.3s ease !important;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4) !important;
      }
      .btn-primary:hover:not(:disabled) {
        transform: translateY(-2px) !important;
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6) !important;
      }
      .btn-primary:disabled {
        opacity: 0.6 !important;
        cursor: not-allowed !important;
      }
      .divider {
        display: flex !important;
        align-items: center !important;
        text-align: center !important;
        margin: 1.5rem 0 !important;
        color: #a0aec0 !important;
        font-size: 0.9rem !important;
      }
      .divider::before,
      .divider::after {
        content: '' !important;
        flex: 1 !important;
        border-bottom: 1px solid #e2e8f0 !important;
      }
      .divider span {
        padding: 0 1rem !important;
        font-weight: 600 !important;
      }
      .google-login-wrapper {
        display: flex !important;
        justify-content: center !important;
        margin: 1rem 0 !important;
      }
      .auth-footer {
        text-align: center !important;
        margin-top: 2rem !important;
        padding-top: 2rem !important;
        border-top: 1px solid #e2e8f0 !important;
      }
      .auth-footer p {
        color: #4a5568 !important;
        font-size: 0.95rem !important;
      }
      .auth-link {
        color: #667eea !important;
        text-decoration: none !important;
        font-weight: 600 !important;
      }
      .auth-link:hover {
        color: #764ba2 !important;
        text-decoration: underline !important;
      }
    `,document.head.appendChild(e),()=>{document.head.removeChild(e)}},[]);let _=e=>{l({...i,[e.target.name]:e.target.value}),m(``)};return(0,d.jsx)(`div`,{className:`auth-container`,children:(0,d.jsxs)(`div`,{className:`auth-card`,children:[(0,d.jsxs)(`div`,{className:`auth-header`,children:[(0,d.jsx)(s,{size:48,className:`auth-icon`}),(0,d.jsx)(`h1`,{children:`Welcome Back`}),(0,d.jsx)(`p`,{children:`Sign in to continue to your account`})]}),p&&(0,d.jsxs)(`div`,{className:`error-message`,children:[(0,d.jsx)(e,{size:20}),(0,d.jsx)(`span`,{children:p})]}),(0,d.jsxs)(`form`,{onSubmit:async e=>{e.preventDefault(),m(``),g(!0);try{let e=await fetch(`${f}/accounts/login/`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(i)}),t=await e.json();e.ok?(localStorage.setItem(`accessToken`,t.tokens.access),localStorage.setItem(`refreshToken`,t.tokens.refresh),localStorage.setItem(`user`,JSON.stringify(t.user)),t.user.is_staff?r(`/admin/dashboard`):r(`/dashboard`)):m(t.error||`Login failed. Please try again.`)}catch(e){console.error(`Login error:`,e),m(`Network error. Please try again.`)}finally{g(!1)}},className:`auth-form`,children:[(0,d.jsxs)(`div`,{className:`form-group`,children:[(0,d.jsxs)(`label`,{htmlFor:`email`,children:[(0,d.jsx)(n,{size:20}),`Email Address`]}),(0,d.jsx)(`input`,{type:`email`,id:`email`,name:`email`,placeholder:`Enter your email`,value:i.email,onChange:_,required:!0})]}),(0,d.jsxs)(`div`,{className:`form-group`,children:[(0,d.jsxs)(`label`,{htmlFor:`password`,children:[(0,d.jsx)(t,{size:20}),`Password`]}),(0,d.jsx)(`input`,{type:`password`,id:`password`,name:`password`,placeholder:`Enter your password`,value:i.password,onChange:_,required:!0})]}),(0,d.jsxs)(`div`,{className:`form-options`,children:[(0,d.jsxs)(`label`,{className:`checkbox-label`,children:[(0,d.jsx)(`input`,{type:`checkbox`}),(0,d.jsx)(`span`,{children:`Remember me`})]}),(0,d.jsx)(o,{to:`/forgot-password`,className:`forgot-link`,children:`Forgot Password?`})]}),(0,d.jsx)(`button`,{type:`submit`,className:`btn-primary`,disabled:h,children:h?`Signing in...`:`Sign In`})]}),(0,d.jsx)(`div`,{className:`divider`,children:(0,d.jsx)(`span`,{children:`OR`})}),(0,d.jsx)(`div`,{className:`google-login-wrapper`,children:(0,d.jsx)(c,{onSuccess:async e=>{g(!0),m(``);try{let t=await fetch(`${f}/accounts/google-auth/`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({token:e.credential})}),n=await t.json();t.ok?(localStorage.setItem(`accessToken`,n.tokens.access),localStorage.setItem(`refreshToken`,n.tokens.refresh),localStorage.setItem(`user`,JSON.stringify(n.user)),n.user.is_staff?r(`/admin/dashboard`):r(`/dashboard`)):m(n.error||`Google login failed. Please try again.`)}catch(e){console.error(`Google login error:`,e),m(`Network error. Please try again.`)}finally{g(!1)}},onError:()=>{m(`Google login failed. Please try again.`)},useOneTap:!0,theme:`outline`,size:`large`,text:`signin_with`,shape:`rectangular`,logo_alignment:`left`})}),(0,d.jsx)(`div`,{className:`auth-footer`,children:(0,d.jsxs)(`p`,{children:[`Don't have an account?`,` `,(0,d.jsx)(o,{to:`/register`,className:`auth-link`,children:`Sign up`})]})})]})})}export{p as default};