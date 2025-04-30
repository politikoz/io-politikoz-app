const Sidewalk: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <defs>
        <pattern
          id="streetPattern"
          patternUnits="userSpaceOnUse"
          width="104"
          height="32"
        >
          <image
            id="Passeio"
            xlinkHref="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGgAAAAgCAYAAAD+Fz2gAAAB8klEQVRogWIMDQ39z4AGLMws0IVGwUAABgYGAAAAAP//YhoN+EEMGBgYAAAAAP//Go2gwQwYGBgAAAAA//8ajaDBDBgYGAAAAAD//xqNoMEMGBgYAAAAAP//Go2gwQwYGBgAAAAA//9iwea+Hz9/jPRwGRyAgYEBAAAA//8azUGDGTAwMAAAAAD//xqNoMEMGBgYAAAAAP//Go2gwQwYGBgAAAAA//8ajaDBDBgYGAAAAAD//8LaSHj86MlID5fBARgYGAAAAAD//xrNQYMZMDAwAAAAAP//Go2gwQwYGBgAAAAA//8ajaDBDBgYGAAAAAD//xqNoMEMGBgYAAAAAP//Yvn27RuGE799ezTSw2VwAAYGBgAAAAD//xrNQYMZMDAwAAAAAP//Go2gwQwYGBgAAAAA//8ajaDBDBgYGAAAAAD//xqNoMEMGBgYAAAAAP//YuFg5xzpYTB4AQMDAwAAAP//Gs1BgxkwMDAAAAAA//8ajaDBDBgYGAAAAAD//xqNoMEMGBgYAAAAAP//Go2gwQwYGBgAAAAA//8ajaDBDBgYGAAAAAD//xqNoMEMGBgYAAAAAP//Go2gwQwYGBgAAAAA//8ajaDBDBgYGAAAAAD//xqNoMEMGBgYAAAAAP//Go2gwQwYGBgAAAAA//8DAMEHDkZ5s/2SAAAAAElFTkSuQmCC"
          />
        </pattern>
      </defs>
      <rect width="100%" height="32" fill="url(#streetPattern)" />
    </svg>
  );
};

export default Sidewalk;
