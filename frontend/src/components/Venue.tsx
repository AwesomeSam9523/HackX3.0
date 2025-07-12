import React from "react";
import TransportCards from "@/components/VenueCard";

const Venue: React.FC = () => {
  return (
    <div>
      {/*  Transport Cards */}
      <div className="my-4 lg:my-12">
        <TransportCards />
      </div>

      <div className="px-6 py-8 md:px-24">
        {/* Address Card */}
        <div className="text-offwhite flex w-full flex-col gap-1 rounded-[1rem] bg-white/6 px-6 py-4 text-center backdrop-blur-md md:px-24 md:py-4">
          <h3 className="mt-4 text-2xl font-semibold">📍 </h3>
          <h3 className="font-avgardn text-2xl font-semibold">
            {" "}
            Manipal University Jaipur
          </h3>
          <p className="font-avgardn mt-1 text-xl text-gray-300">
            Jaipur-Ajmer Express Highway, Dehmi Kalan, Near GVK Toll Plaza{" "}
            <br />
            Jaipur, Rajasthan 303007
          </p>
        </div>

        {/* Map */}
        <div className="mt-8 mb-15 w-full rounded-[1.5rem] border-3 border-dashed border-white/50 bg-black/30 p-4 md:p-6">
          <div className="h-[20rem] w-full overflow-hidden rounded-[1rem] md:h-[25rem]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d5086.387345091763!2d75.5675908396371!3d26.841597323992485!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c4850e1a5a723%3A0x85186d7bad10eac4!2sManipal%20University%20Library!5e0!3m2!1sen!2sin!4v1720507553431!5m2!1sen!2sin"
              className="h-full w-full hue-rotate-180 invert-[90%]"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Venue;
