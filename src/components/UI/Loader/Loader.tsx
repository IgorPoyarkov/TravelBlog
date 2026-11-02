import useUtils from "../../../hooks/useUtils";

interface LoaderProps {
  count?: number;
  size?: number;
  modifer?: string;
}

const Loader = ({ count = 12, size = 320, modifer = "" }: LoaderProps) => {
  const { getRandomInRange } = useUtils();
  const classModifer = modifer !=="" ? `loader--${modifer}`  : "";
  return (
    <div
      className={`loader ${classModifer}`}
      style={
        {
          "--size": size,
          "--count": count,
        } as React.CSSProperties
      }
    >
      <ul className="loader-list">
        {Array.from({ length: count }).map((_, index) => (
          <li
            className={`loader-item ${index < count / 2 ? "" : "loader-item--right"}`}
            style={
              {
                "--delay": getRandomInRange(30, 80),
                "--index": index + 1,
              } as React.CSSProperties
            }
            key={index}
          >
            <svg className="loader-icon">
              <use href="/sprite.svg#logo-icon" />
            </svg>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Loader;
