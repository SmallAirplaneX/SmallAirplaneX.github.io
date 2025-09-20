/// <reference types="vite/client" />
// 支持别名路径类型识别
declare module "@/*" {
  export default any;
}

declare module "@com/*" {
  export default any;
}

declare module "@components/*" {
  export default any;
}
