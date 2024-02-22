
'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';


const Dishes = () => {
   
    return (
        <div>
            <div className="flex items-center text-gray-800 mb-2 font-sans">
                <div className="p-4 w-full">
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12 sm:col-span-6 md:col-span-3">
                            <div className="flex flex-row bg-gradient-to-r bg-pink-500 shadow-md rounded p-4 whitespace-nowrap">
                                <div className="flex items-center justify-center flex-shrink-0 h-12 w-12 rounded-xl bg-white">
                                    <Image
                                        src={`/cut.png`}
                                        className=" object-cover rounded-md"
                                        alt='logo' height={30} width={30}
                                    />
                                </div>
                                <div className="flex flex-col flex-grow ml-4">
                                    <div className="text-sm text-white font-medium"></div>
                                    <div className="font-bold text-sm text-white">
                                        
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="col-span-12 sm:col-span-6 md:col-span-3">

                            <div className="flex flex-row   bg-yellow-500 shadow-md rounded p-4 whitespace-nowrap">

                                <div className="flex items-center justify-center flex-shrink-0 h-12 w-12 rounded-xl bg-white">
                                    <Image
                                        src={`/chair.png`}
                                        className=" object-cover rounded-md"
                                        alt='logo' height={30} width={30}
                                    />
                                </div>
                                <div className="flex flex-col flex-grow ml-4">
                                    <div className="text-sm text-white font-medium"></div>
                                    <div className="font-bold text-sm text-white">
                                    </div>
                                </div>
                            </div>

                        </div>


                        <div className="col-span-12 sm:col-span-6 md:col-span-3">

                            <div className="flex flex-row bg-violet-400 shadow-md rounded p-4 whitespace-nowrap">
                                <div className="flex items-center justify-center flex-shrink-0 h-12 w-12 rounded-xl bg-white">
                                    <Image
                                        src={`/new-year.png`}
                                        className="object-cover rounded-md"
                                        alt='logo' height={30} width={30}
                                    />
                                </div>
                                <div className="flex flex-col flex-grow ml-4">
                                    <div className="text-sm text-white whitespace-nowrap font-medium"></div>
                                    <div className="font-bold text-sm text-white">
                                    </div>
                                </div>
                            </div>

                        </div>


                        <div className="col-span-12 sm:col-span-6 md:col-span-3">

                            <div className="flex flex-row bg-amber-700 shadow-md rounded p-4 whitespace-nowrap">
                                <div className="flex items-center justify-center flex-shrink-0 h-12 w-12 rounded-xl bg-white">
                                    <Image
                                        src={`/wallet.png`}
                                        className="object-cover rounded-md"
                                        alt='logo' height={30} width={30}
                                    />
                                </div>
                                <div className="flex flex-col flex-grow ml-4">
                                    <div className="text-sm text-white font-medium"></div>
                                    <div className="font-bold text-sm text-white">
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dishes;