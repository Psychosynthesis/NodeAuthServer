declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

declare type RGB = `rgb(${number}, ${number}, ${number})`;
declare type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
declare type HEX = `#${string}`;
declare type Color = RGB | RGBA | HEX;

declare type VoidFunc = () => void;
