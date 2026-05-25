import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Men from "../../assets/images/Men.png";
import Kids from "../../assets/images/Kids.png";
import Women from "../../assets/images/Women.png";

function Slider() {

    const sliderImages = [Men, Kids, Women];

    return (
        <div className="mx-3 sm:mx-5 mt-8 sm:mt-10">
            <Swiper
                modules={[Navigation, Autoplay, Pagination]}
                spaceBetween={20}
                slidesPerView={1}
                navigation pagination={{ clickable: true }}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                loop={true}
                className="slider__swiper overflow-hidden"
            >
                {sliderImages.map((sliderImage, index) => (
                    <SwiperSlide key={index}>
                        <img
                            src={sliderImage}
                            alt={`Image ${index}`}
                            className="w-full h-[180px]
                            sm:h-[250px] md:h-[320px] 
                            lg:h-[420px] xl:h-[500px]
                            object-cover rounded-2xl"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

export default Slider;