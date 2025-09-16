import { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 5,
    total: 0,
    links: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>("");
  const [cameraBrandFilter, setCameraBrandFilter] = useState<
    string | undefined
  >("");

  // Fetch photos with pagination
  const fetchPhotos = async (page = 1, query = "") => {
    const { pageData } = await fetchPhotosApi(page, query);

    if (!pageData) return;
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
    fetchPhotos(1, searchTerm); // Always reset to page 1 when searching
  }, [searchTerm]);

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    fetchPhotos(1, query); // Reset to page 1 when searching
  };

  const handleFilterReset = () => {
    setCategoryFilter("");
    setCameraBrandFilter("");
  };

  // Filter photos based on current filters
  const filteredPhotos = photos?.filter((photo) => {
    const matchesCategory = categoryFilter
      ? photo.photo_category === categoryFilter
      : true;
    const matchesCameraBrand = cameraBrandFilter
      ? photo.camera_brand === cameraBrandFilter
      : true;
    return matchesCategory && matchesCameraBrand;
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 w-full p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-7xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row w-full mb-6 justify-between items-start md:items-center gap-4">
          <h1 className="text-stone-800 font-bold text-xl md:text-2xl">
            Photos
          </h1>
          <AddPhotoDialog
            setPhotos={setPhotos}
            fetchPhotos={fetchPhotos}
          />
        </div>

        <div className="flex flex-col md:flex-row w-full gap-4 mb-6">
          <SearchBar onSearch={handleSearch} />
          <div className="flex flex-wrap items-end justify-end gap-4 flex-1">
            <SelectFilterPhoto
              label="Category"
              options={[
                ...new Set(photos.map((photo) => photo.photo_category)),
              ]}
              value={categoryFilter || ""}
              onChange={(val) => setCategoryFilter(val)}
            />
            <SelectFilterPhoto
              label="Camera Brand"
              options={[...new Set(photos.map((photo) => photo.camera_brand))]}
              value={cameraBrandFilter || ""}
              onChange={(val) => setCameraBrandFilter(val)}
            />
            <Button type="button" variant="outline" onClick={handleFilterReset}>
              Reset
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 min-w-[700px] table-fixed">
            <thead className="text-xs text-gray-700 bg-gray-50">
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
                  Gears & Accessories
                </th>
                <th scope="col" className="px-3 py-3">
                  Photo Taken
                </th>
                <th scope="col" className="px-3 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPhotos.length > 0 ? (
                filteredPhotos.map((photo) => (
                  <tr
                    className="hover:bg-gray-50 dark:hover:bg-gray-100"
                    key={photo.id}
                  >
                    <td className="px-3 py-2">
                      <img
                        className="w-24 h-24 object-cover rounded-md"
                        src={
                          photo.photo_path
                            ? getPhotoUrl(photo.photo_path)
                            : "https://placehold.co/600x400.png"
                        }
                        alt={`Photo titled ${photo.title}`}
                        onError={(e) =>
                        (e.currentTarget.src =
                          "https://placehold.co/600x400.png")
                        }
                      />
                    </td>
                    <td className="px-3 py-4">{photo.title}</td>
                    <td className="px-3 py-4">{photo.photo_category}</td>
                    <td className="px-3 py-4">{photo.camera_brand}</td>
                    <td className="px-3 py-4 truncate">{photo.gear_used}</td>
                    <td className="px-3 py-4">
                      {" "}
                      {format(new Date(photo.photo_taken), "MMM d, yyyy")}
                    </td>

                    <td className="px-3 py-8 text-right flex gap-2">
                      <ViewPhotoDialog photo={photo} />
                      <EditPhotoDialog
                        photo={photo}
                        setPhotos={setPhotos}
                      />
                      <DeletePhotoDialog photo={photo} setPhotos={setPhotos} fetchPhotos={fetchPhotos} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-8">
                    No Data Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex w-full mb-6 justify-end mt-5">
          <PaginationPhoto
            pagination={pagination}
            onPageChange={(page) => fetchPhotos(page, searchTerm)}
          />
        </div>
      </div>
    </div>
  );
}
