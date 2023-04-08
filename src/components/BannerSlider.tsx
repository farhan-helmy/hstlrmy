import Image from "next/image";


const BannerSlider = ()  => {
  return (
    <div className="relative overflow-hidden bg-white">
      <div className="pt-16 pb-80 sm:pt-24 sm:pb-40 lg:pt-40 lg:pb-48">
        <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
          <div className="sm:max-w-lg">
            <h1 className="font text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Welcome to Demokedai
            </h1>
            <p className="mt-4 text-xl text-gray-500">
              {' '}
            </p>
          </div>
          <div>
            <div className="mt-10">
              {/* Decorative image grid */}
              <div
                aria-hidden="true"
                className="pointer-events-none lg:absolute lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-7xl"
              >
                <div className="absolute transform sm:left-1/2 sm:top-0 sm:translate-x-8 lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-8">
                  <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div className="h-64 w-44 overflow-hidden rounded-lg sm:opacity-0 lg:opacity-100">
                        <Image
                          src="https://hustlermy-dev.s3.ap-southeast-1.amazonaws.com/next-s3-uploads/b1eabd11-4614-4d34-8212-665c8e47318f/OIG-(2).jpg"
                          alt="nah"
                          className="h-full w-full object-cover object-center"
                          width={200}
                          height={200}
                        />
                      </div>
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                        <Image
                          src="https://hustlermy-dev.s3.ap-southeast-1.amazonaws.com/next-s3-uploads/b1eabd11-4614-4d34-8212-665c8e47318f/OIG-(2).jpg"
                          alt=""
                          className="h-full w-full object-cover object-center"
                          width={200}
                          height={200}
                        />
                      </div>
                    </div>
                    <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                        <Image
                          src="https://hustlermy-dev.s3.ap-southeast-1.amazonaws.com/next-s3-uploads/b1eabd11-4614-4d34-8212-665c8e47318f/OIG-(2).jpg"
                          alt=""
                          className="h-full w-full object-cover object-center"
                          width={200}
                          height={200}
                        />
                      </div>
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                        <Image
                          src="https://hustlermy-dev.s3.ap-southeast-1.amazonaws.com/next-s3-uploads/b1eabd11-4614-4d34-8212-665c8e47318f/OIG-(2).jpg"
                          alt=""
                          className="h-full w-full object-cover object-center"
                          width={200}
                          height={200}
                        />
                      </div>
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                        <Image
                          src="https://hustlermy-dev.s3.ap-southeast-1.amazonaws.com/next-s3-uploads/b1eabd11-4614-4d34-8212-665c8e47318f/OIG-(2).jpg"
                          alt=""
                          className="h-full w-full object-cover object-center"
                          width={200}
                          height={200}
                        />
                      </div>
                    </div>
                    <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                        <Image
                          src="https://hustlermy-dev.s3.ap-southeast-1.amazonaws.com/next-s3-uploads/b1eabd11-4614-4d34-8212-665c8e47318f/OIG-(2).jpg"
                          alt=""
                          className="h-full w-full object-cover object-center"
                          width={200}
                          height={200}
                        />
                      </div>
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                        <Image
                          src="https://hustlermy-dev.s3.ap-southeast-1.amazonaws.com/next-s3-uploads/b1eabd11-4614-4d34-8212-665c8e47318f/OIG-(2).jpg"
                          alt=""
                          className="h-full w-full object-cover object-center"
                          width={200}
                          height={200}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <a
                href="#"
                className="inline-block rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-center font-medium text-white hover:bg-indigo-700"
              >
                Shop Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}

export default BannerSlider;
