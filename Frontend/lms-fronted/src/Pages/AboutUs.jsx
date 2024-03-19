import React from "react";
import HomeLayout from "../Layouts/HomeLayout";
import aboutmainimage from "../assets/images/aboutMainImage.png";
import CarousalSlide from "../Components/CarousalSlide";
import celebrities from "../Constants/CelebretiesData";

function AboutUs() {
  return (
    <HomeLayout>
      <div className="pl-20 pt-20 flex flex-col text-white">
        <div className="flex items-center gap-5 mx-10">
          <section className="w-1/2 space-y-10">
            <h1 className="text-4xl text-yellow-500 font-semibold">
              Affordable and quality education
            </h1>
            <p className="text-lg text-gray-200">
              Our goal is to provide quality education to the world. We provide
              a platform for aspiring teachers and students to share their
              skills, creativity, and knowledge with each other to empower the
              growth and wellness of mankind.
            </p>
          </section>
          <div className="w-1/2">
            <img
              className="drop-shadow-xl"
              id="test1"
              style={{
                filter: "drop-shadow(0px 10px 10px rgb(0,0,0))",
              }}
              src={aboutmainimage}
              alt="aboutmainimage"
            />
          </div>
        </div>

        {/* Carousel Start Here */}

        <div className="carousel w-[70%] m-auto my-16">
          {celebrities &&
            celebrities.map((celebrity) => (
              <CarousalSlide
                {...celebrity}
                key={celebrity.slideNumber}
                totalSlide={celebrity.length}
              />
            ))}
        </div>
      </div>
    </HomeLayout>
  );
}

export default AboutUs;
