import { useState, useEffect, type SetStateAction } from "react";
import AddPhotoDialog from "@/components/photos/addPhotoDialog";
import { fetchPhotosApi } from "@/services/api";
import EditPhotoDialog from "@/components/photos/editPhotoDialog";
import type { Photo } from "@/types/photo";
import DeletePhotoDialog from "@/components/photos/deletePhotoDialog";
import PaginationPhoto from "@/components/photos/paginationPhoto";
import SearchBar from "@/components/photos/searchBarPhoto";
import ViewPhotoDialog from "@/components/photos/viewPhotoDialog";
import { set } from "date-fns";

export default function PhotosPage() {

    const [photos, setPhotos] = useState<Photo[]>([]);
    // const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 5,
        total: 0,
        links: [],
    });
    const [searchTerm, setSearchTerm] = useState("");


    // Fetch photos with pagination
    const fetchPhotos = async (page = 1, query = "") => {

        const pageData = await fetchPhotosApi(page, query);
        setPhotos(pageData.data);
        setPagination({
            current_page: pageData.current_page,
            last_page: pageData.last_page,
            per_page: pageData.per_page,
            total: pageData.total,
            links: pageData.links,
        });
    };

    useEffect(() => {
        fetchPhotos(1, searchTerm); // always reset to page 1 when searching
    }, []);

    // Handle search (server-driven)
    const handleSearch = (query: string) => {
        setSearchTerm(query);
        fetchPhotos(1, query); // always reset to page 1 when searching
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-200">
            <div className="p-8 bg-white rounded-lg shadow-md">
                <div className="flex w-full mb-6 justify-between items-center"><h1 className="text-stone-800 font-bold">Photo List</h1></div>
                <div className="flex w-full mb-6 justify-between items-center">
                    <SearchBar onSearch={handleSearch} />
                    <AddPhotoDialog setPhotos={setPhotos} fetchPhotos={fetchPhotos} />
                </div>
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            {/* <th scope="col" className="px-6 py-3">ID</th> */}
                            <th scope="col" className="px-6 py-3">Image</th>
                            <th scope="col" className="px-6 py-3">Title</th>
                            <th scope="col" className="px-6 py-3">Category</th>
                            <th scope="col" className="px-6 py-3">Description</th>
                            <th scope="col" className="px-6 py-3">Camera Brand</th>
                            <th scope="col" className="px-6 py-3">Gears/Accessories</th>
                            <th scope="col" className="px-6 py-3">Location</th>
                            <th scope="col" className="px-6 py-3">Photo Taken</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>

                    </thead>

                    <tbody>
                        {/* changed photos to filteredPhotos */}
                        {photos.map((photo: Photo) => (
                            <tr className="hover:bg-gray-50 dark:hover:bg-gray-100" key={photo.id}>
                                {/* <td className="px-6 py-4">{photo.id}</td> */}

                                <td className="px-3 py-2">
                                    {photo.photo_path ?
                                        <img
                                            className="w-24 h-24 object-cover rounded-md"
                                            src={`http://127.0.0.1:8000/storage/${photo.photo_path}`}
                                            alt={photo.title}
                                            onError={(e) => {
                                                (e.currentTarget as HTMLImageElement).src = "https://placehold.co/600x400.png";
                                            }}
                                        />
                                        : <img className="w-24 h-24 object-cover rounded-md" src="https://placehold.co/600x400.png" alt="default-image" />}
                                </td>
                                <td className="px-6 py-4">{photo.title}</td>
                                <td className="px-6 py-4">{photo.photo_category}</td>
                                <td className="px-6 py-4">{photo.description}</td>
                                <td className="px-6 py-4">{photo.camera_brand}</td>
                                <td className="px-6 py-4">{photo.gear_used}</td>
                                <td className="px-6 py-4">{photo.location}</td>
                                <td className="px-6 py-4">{photo.photo_taken}</td>

                                <td className="px-6 py-8 text-right flex gap-2">
                                    {/* <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a> */}
                                    <ViewPhotoDialog photo={photo} />
                                    <EditPhotoDialog photo={photo} setPhotos={setPhotos} />
                                    <DeletePhotoDialog photo={photo} setPhotos={setPhotos}></DeletePhotoDialog>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex w-full mb-6 justify-end mt-5">
                    <PaginationPhoto pagination={pagination} onPageChange={(page) => fetchPhotos(page, searchTerm)} ></PaginationPhoto>
                </div>

            </div>



        </div>
    );
}