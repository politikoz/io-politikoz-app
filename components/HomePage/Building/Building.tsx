const Building: React.FC = () => {
  return (
    <div className="relative w-full h-full flex items-end">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1600 1480"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-auto max-h-full block"
      >
        <image
          id="frontBuilding"
          data-name="frontBuilding"
          xlinkHref="/images/frontBuilding.svg"
        />
        <text
          x="660"
          y="950"
          fill="#FFFFFF"
          fontFamily="'Press Start 2P', cursive"
          fontSize="100px"
        >
          KOZ
        </text>
      </svg>
    </div>
  );
};

export default Building;
