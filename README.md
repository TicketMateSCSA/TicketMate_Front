# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


## 개발 환경 (Local)
### 0. 디렉토리 구조 
<img width="500" alt="디렉토리 구조" src="https://github.com/user-attachments/assets/b3001458-9188-4fa9-adf2-bf9a96ff36dc" />
<br> 

### 1. Node.js 설치 
<img width="500" alt="nodejs" src="https://github.com/user-attachments/assets/4b974341-87bf-459e-8b0e-43a3494c4385" />
<br> 

### 2. npm 설치 
```bash
PS C:\STUDY\WebProject-TicketMate\TicketMate_Front> cd frontend
PS C:\STUDY\WebProject-TicketMate\TicketMate_Front\frontend> npm install  # 반드시 package.json 파일이 있는 경로에서 설치 

# 버전 확인 
PS C:\WINDOWS\system32> node --version
v24.11.1
PS C:\WINDOWS\system32> npm --version
11.6.2
```
<br> 

### 3. 웹 서버 실행 
```bash
PS C:\STUDY\WebProject-TicketMate\TicketMate_Front\frontend> npm run dev

> frontend@0.0.0 dev
> vite


  VITE v7.2.2  ready in 2796 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

> 홈페이지가 떠야함
<img width="700" alt="image" src="https://github.com/user-attachments/assets/4f8a93a8-adcc-4bc4-bb9b-4f6f396d3eb1" />


