import main from '../public/main.jpg';
import type { NextPage } from 'next';

const Home: NextPage = () => {
  return (
    <div className="">
      <div
        style={{ backgroundImage: `url(${main.src})` }}
        className="h-screen pt-24 bg-cover"
      >
        <div className="bg-white mx-16 px-4 sm:px ">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Exercitationem, necessitatibus atque accusantium magnam, nulla itaque
          fugit, eum eos fuga ducimus architecto repellendus a dicta nihil
          nostrum similique pariatur repellat recusandae? Dolor eaque vitae ipsa
          unde optio et repellat ipsum neque!
        </div>
      </div>

      <div className="h-screen px-4">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Unde obcaecati
        libero incidunt nisi voluptates dolorem amet culpa, ex fugiat at
        molestiae. Assumenda deleniti magnam non veritatis nihil omnis ratione
        aspernatur possimus est architecto repudiandae hic, similique
        consequatur. Provident voluptatum iste aperiam eius perferendis saepe et
        veritatis ipsa, cumque possimus sequi id enim nam rem cupiditate hic
        explicabo obcaecati, natus dolorem.
        <div className="overflow-hidden">{/* <Carousel></Carousel> */}</div>
      </div>
    </div>
  );
};

export default Home;
