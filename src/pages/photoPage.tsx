import { useState, useEffect, type SetStateAction } from "react";
import AddPhotoDialog from "@/components/photos/addPhotoDialog";
import { fetchPhotosApi } from "@/services/api";
import EditPhotoDialog from "@/components/photos/editPhotoDialog";
import type { Photo } from "@/types/photo";
import DeletePhotoDialog from "@/components/photos/deletePhotoDialog";
import PaginationPhoto from "@/components/photos/paginationPhoto";
import SearchBar from "@/components/photos/searchBarPhoto";
import ViewPhotoDialog from "@/components/photos/viewPhotoDialog";
import { getPhotoUrl } from "@/helper/getPhotoUrl";
import { SelectFilterPhoto } from "@/components/photos/selectFilterPhoto";
import ResetFilterButton from "@/components/photos/resetFilterButton";

export default function PhotosPage() {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>(photos);
    const [categoryFilter, setCategoryFilter] = useState<string | undefined>("");
    const [cameraBrandFilter, setCameraBrandFilter] = useState<string | undefined>("");

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

        if (!pageData) return;
        setPhotos(pageData.data);
        // console.log(pageData.data);
        // setFilteredPhotos(pageData.data);
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

    useEffect(() => {
        setFilteredPhotos(photos); // reset filtered photos when photos change  (add, edit, delete)
    }, [photos]);

    const handleFilterReset = () => {
        setCategoryFilter("");
    };
    // Handle search (server-driven)
    const handleSearch = (query: string) => {
        handleFilterReset();
        setSearchTerm(query);
        fetchPhotos(1, query); // always reset to page 1 when searching
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-200 w-full p-4">
            <div className="bg-white rounded-lg shadow-md w-full max-w-7xl p-6 md:p-8">

                <div className="flex flex-col md:flex-row w-full mb-6 justify-between items-start md:items-center gap-4">
                    <h1 className="text-stone-800 font-bold text-xl md:text-2xl">Photo List</h1>
                    <AddPhotoDialog setPhotos={setPhotos} fetchPhotos={fetchPhotos} />
                </div>

                <div className="flex flex-col md:flex-row w-full gap-4 mb-6">

                    <SearchBar onSearch={handleSearch} />
                    <div className="flex flex-wrap justify-end gap-4 flex-1">
                        <SelectFilterPhoto
                            label="Category"
                            options={[...new Set(filteredPhotos.map((photo) => photo.photo_category))]}
                            value={categoryFilter || ""}
                            onChange={(val) => {
                                setCategoryFilter(val);
                                setFilteredPhotos(
                                    val
                                        ? photos.filter((photo) => photo.photo_category === val)
                                        : photos
                                );
                            }}
                        />
                        <SelectFilterPhoto
                            label="Camera Brand"
                            options={[...new Set(filteredPhotos.map((photo) => photo.camera_brand))]}
                            value={cameraBrandFilter || ""}
                            onChange={(val) => {
                                setCameraBrandFilter(val);
                                setFilteredPhotos(
                                    val
                                        ? photos.filter((photo) => photo.camera_brand === val)
                                        : photos
                                );
                            }}
                        />
                        <ResetFilterButton
                            onClick={() => {
                                setCategoryFilter("");
                                setCameraBrandFilter("");
                                setFilteredPhotos(photos);
                            }}

                        ></ResetFilterButton>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 min-w-[700px]">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-3 py-3">
                                    Image
                                </th>
                                <th scope="col" className="px-3 py-3">
                                    Title
                                </th>
                                <th scope="col" className="px-3 py-3">
                                    Category
                                </th>
                                <th scope="col" className="px-3 py-3">
                                    Camera Brand
                                </th>
                                <th scope="col" className="px-3 py-3">
                                    Gears/Accessories
                                </th>
                                <th scope="col" className="px-3 py-3">
                                    Photo Taken
                                </th>
                                <th scope="col" className="px-3 py-3">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        {filteredPhotos.length > 0 ? (
                            <tbody>
                                {filteredPhotos.map((photo: Photo) => (
                                    <tr
                                        className="hover:bg-gray-50 dark:hover:bg-gray-100"
                                        key={photo.id}
                                    >
                                        <td className="px-3 py-2">
                                            {photo.photo_path ? (
                                                <img
                                                    className="w-24 h-24 object-cover rounded-md"
                                                    src={getPhotoUrl(photo.photo_path)}
                                                    alt={photo.title}
                                                    onError={(e) => {
                                                        (e.currentTarget as HTMLImageElement).src =
                                                            "https://placehold.co/600x400.png";
                                                    }}
                                                />
                                            ) : (
                                                <img
                                                    className="w-24 h-24 object-cover rounded-md"
                                                    src="https://placehold.co/600x400.png"
                                                    alt="default-image"
                                                />
                                            )}
                                        </td>
                                        <td className="px-3 py-4">{photo.title}</td>
                                        <td className="px-3 py-4">{photo.photo_category}</td>
                                        <td className="px-3 py-4">{photo.camera_brand}</td>
                                        <td className="px-3 py-4">{photo.gear_used}</td>
                                        <td className="px-3 py-4">{photo.photo_taken}</td>

                                        <td className="px-3 py-8 text-right flex gap-2">
                                            <ViewPhotoDialog photo={photo} />
                                            <EditPhotoDialog photo={photo} setPhotos={setPhotos} />
                                            <DeletePhotoDialog
                                                photo={photo}
                                                setPhotos={setPhotos}
                                            ></DeletePhotoDialog>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        ) : (
                            <tbody>
                                <tr>
                                    <td colSpan={7} className="text-center py-8">
                                        No Data Found
                                    </td>
                                </tr>
                            </tbody>
                        )}
                    </table>
                </div>
                <div className="flex w-full mb-6 justify-end mt-5">
                    <PaginationPhoto
                        pagination={pagination}
                        onPageChange={(page) => fetchPhotos(page, searchTerm)}
                    ></PaginationPhoto>
                </div>
            </div>
        </div>
    );
}
