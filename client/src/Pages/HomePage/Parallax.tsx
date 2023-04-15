import React from 'react';

export interface ParallaxProps {
  image: string,
  children: React.ReactNode
}

const Parallax = (props: ParallaxProps) => {
  const handleScroll = () => {
    const parallax = document.querySelector<HTMLElement>('.parallax');
    const offset = window.pageYOffset;
    if(!parallax)
      return
    parallax.style.backgroundPositionY = `${offset * 0.7}px`;
  };

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
    <div className="parallax w-full h-screen max-w-[100%] bg-no-repeat bg-center bg-cover" style={{ backgroundImage: `url(${props.image})` }}>
      <div className="pt-20 sm:pt-40 pb-16 sm:pb-32">
        {props.children}
      </div>
    </div>
    </>
  );
};

export default Parallax;
