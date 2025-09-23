import React from 'react';

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  alt?: string;
};

const Logo: React.FC<Props> = ({ alt = 'Everything Grocery', className, ...props }) => {
  const [src, setSrc] = React.useState<string>('/logo.png');

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => {
        if (src !== '/icon-512.png') {
          setSrc('/icon-512.png');
        }
      }}
      {...props}
    />
  );
};

export default Logo;
