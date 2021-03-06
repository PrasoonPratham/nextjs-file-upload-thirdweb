import { useState, useCallback, useEffect, useMemo } from 'react';
import Head from 'next/head';

import { ThirdwebSDK } from '@3rdweb/sdk';
import { ConnectWallet } from '@3rdweb/react';
import { useWeb3 } from '@3rdweb/hooks';

import { useFormik } from 'formik';
import { useDropzone } from 'react-dropzone';

// Regeneration error fix:
import 'regenerator-runtime/runtime';

const validate = (values) => {
    const errors = {};
    if (!values.name) {
        errors.name = (
            <div
                class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
            >
                <strong class="font-bold">No Name!</strong>
                <span class="block sm:inline"> Gotta name your NFT c'mon</span>
                <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
                    <svg
                        class="fill-current h-6 w-6 text-red-500"
                        role="button"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                    >
                        <title>Close</title>
                        <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                    </svg>
                </span>
            </div>
        );
    } else if (values.name.length > 100) {
        errors.name =
            "Must be 100 characters or less, it's name not your autobiography";
    }

    if (!values.description) {
        errors.description = (
            <div
                class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
            >
                <strong class="font-bold">No Description!</strong>
                <span class="block sm:inline"> No NFT!</span>
                <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
                    <svg
                        class="fill-current h-6 w-6 text-red-500"
                        role="button"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                    >
                        <title>Close</title>
                        <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                    </svg>
                </span>
            </div>
        );
    } else if (values.description.length > 3000) {
        errors.description =
            "Must be 3000 characters or less, this isn't your school essay";
    }
    return errors;
};


export default function Home() {
    const { address, provider } = useWeb3();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    
      const sdk = useMemo(
          () =>
              provider
                  ? new ThirdwebSDK(provider.getSigner())
                  : new ThirdwebSDK(),
          [provider]
      );

    // NFT module.
    const nftMod = sdk.getNFTModule("0xD91A8C3Dd5fa4F829A009FCd9C1DDc8417DB78f9");

    const onDrop = useCallback(async (uploadedFiles) => {
        if (uploadedFiles.length === 0) {
            setError(true);
            return;
        }

        // State updates.
        setError(false);
        setLoading(true);
        setFile(uploadedFiles[0]);

        console.log(uploadedFiles[0]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: 'image/*',
        multiple: false,
        onDrop
    });

    function handleUpload(values) {
        if (file === null) {
            setError(true);
            return;
        }

        // Minting the NFT asynchronously using IIFE.
        (async () => {
            console.log(
                await nftMod.mint({
                    name: values.name,
                    description: values.description,
                    image: file,
                    properties: {}
                })
            );
        })();
    }

    const formik = useFormik({
        initialValues: {
            name: '',
            description: ''
        },
        validate,
        onSubmit: (values) => handleUpload(values)
    });

    return (
        <>
            <Head>
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@PrasoonPratham" />
                <meta name="twitter:title" content="Pratham's NFT giveaway" />
                <meta
                    name="twitter:description"
                    content="You mint NFTs, I pay for the gas"
                />
                <meta name="twitter:image" content="https://raw.githubusercontent.com/PrasoonPratham/nft-nextjs/main/public/bg.png" />
            </Head>

            <div
                className="relative flex items-center justify-center min-h-screen px-4 py-12 bg-no-repeat bg-cover bg-gray-50 sm:px-6 lg:px-8"
                style={{
                    backgroundImage: 'url(bg.png)'
                }}
            >
                <div className="absolute inset-0 z-0 bg-black opacity-60 " />
                <div className="z-10 w-full p-10 bg-white sm:max-w-lg rounded-xl">
                    <div className="text-center">
                        <h2 className="mt-5 text-3xl font-bold text-gray-900">
                            NFT Giveaway!
                        </h2>
                        <p className="mt-2 text-sm text-gray-400">
                            by Pratham Prasoon made with Thirdweb
                        </p>
                    </div>

                    <button className="w-full mt-5">
                        <ConnectWallet>Connect Metamask</ConnectWallet>
                    </button>

                    {address ? (
                        <button className="w-full rounded px-3 my-2 py-2 border-b-3 border-l-2 shadow-lg bg-blue-600 border-blue-700 text-white">
                            <a
                                href={
                                    'https://polygonscan.com/address/' +
                                    address +
                                    '#tokentxnsErc721'
                                }
                                target="_blank"
                            >
                                Check Recent Transactions
                            </a>
                        </button>
                    ) : null}

                    <form
                        className="mt-3 space-y-3"
                        action="#"
                        method="POST"
                        onSubmit={formik.handleSubmit}
                    >
                        <div className="grid grid-cols-1 space-y-2">
                            <label className="text-sm font-bold tracking-wide text-gray-500">
                                Name of the NFT
                            </label>
                            {formik.errors.name && formik.touched.name ? (
                                <div>{formik.errors.name}</div>
                            ) : null}
                            <input
                                className="p-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                                type="text"
                                id="name"
                                name="name"
                                placeholder="My very cool NFT"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.name}
                            />
                            <label className="text-sm font-bold tracking-wide text-gray-500">
                                Description
                            </label>
                            {formik.errors.description &&
                            formik.touched.description ? (
                                <div>{formik.errors.description}</div>
                            ) : null}
                            <input
                                className="p-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                                type="text"
                                id="description"
                                name="description"
                                placeholder="Bored Ape"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.description}
                            />
                        </div>
                        <div className="grid grid-cols-1 space-y-2">
                            <label className="text-sm font-bold tracking-wide text-gray-500">
                                Attach Document
                            </label>

                            <div
                                className="flex w-full items-center justify-center bg-grey-lighter"
                                {...getRootProps()}
                            >
                                <input {...getInputProps()} />
                                <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide border border-blue cursor-pointer hover:bg-blue hover:text-blue-600">
                                    <svg
                                        className="w-8 h-8"
                                        fill="currentColor"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                                    </svg>

                                    {isDragActive ? (
                                        <span className="mt-2 text-base leading-normal">
                                            Drop the image here ...
                                        </span>
                                    ) : (
                                        <span>
                                            Drag and drop some files here, or
                                            click to select files
                                        </span>
                                    )}
                                </label>
                            </div>
                            {file ? (
                                <div class="bg-green-200 px-6 py-4 w-full my-4 rounded-md text-lg flex items-center mx-auto ">
                                    <svg
                                        viewBox="0 0 24 24"
                                        class="text-green-600 w-5 h-5 sm:w-5 sm:h-5 mr-3"
                                    >
                                        <path
                                            fill="currentColor"
                                            d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
                                        ></path>
                                    </svg>
                                    <span class="text-green-800">
                                        {' '}
                                        Your image has been uploaded.{' '}
                                    </span>
                                </div>
                            ) : null}
                        </div>
                        <p className="text-sm text-gray-300">
                            <span>
                                {"File type: jpg.jpeg and other common types of images"}
                            </span>
                        </p>
                        <div>
                            <button
                                type="submit"
                                className="flex justify-center w-full px-4 py-3 font-semibold text-white transition-transform transform bg-blue-600 rounded-md shadow-lg outline-none focus:ring-4 active:scale-x-75"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                    />
                                </svg>
                                <span className="ml-2">Mint it!</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <style />
        </>
    );
}
