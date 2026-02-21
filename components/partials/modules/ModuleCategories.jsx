import { TagsInput, TagsInputClear, TagsInputInput, TagsInputItem, TagsInputLabel, TagsInputList, TagsInputDropdown } from "@/components/ui/tags-input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { X, Trash, Save } from 'lucide-react';
import Required from "@/components/partials/Required";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from 'lucide-react';
import { useState } from "react";

export const ModuleCategories = ({ initialCategories = [] }) => {
    const [categories, setCategories] = useState(initialCategories);
    const [edit, setEdit] = useState(false);

    const categorySuggestions = [
        "Technology",
        "Business",
        "Science",
        "Health",
        "Sports",
        "Entertainment",
        "Politics",
        "Education"
    ];

    const handleSaveCategories = () => {

    }

    return (
        <div className='rounded-xl bg-white shadow-sm'>
            <div className='flex flex-col p-4'>
                <h4 className='font-semibold text-sm'>Categories <Required /></h4>
                <p className='text-xs text-gray-600'>Tentukan kategori untuk materi</p>
            </div>
            <div className='border-t border-dashed px-4 py-3 flex flex-col gap-2'>
                <TagsInput
                    value={categories}
                    onValueChange={setCategories}
                    editable={edit}
                    addOnPaste
                    suggestions={categorySuggestions}
                >
                    <TagsInputList className="rounded-xl border-0 p-0 focus-visible:outline-none focus-within:ring-0">
                        {(categories?.length === 0 && !edit) ? (
                            <div className="flex items-center justify-center w-full">
                                <p className="text-gray-600">Belum ada categories</p>
                            </div>
                        ) : categories.map((category) => (
                            <TagsInputItem key={category} value={category} className="rounded-lg">
                                {category}
                            </TagsInputItem>
                        ))}
                        <TagsInputInput placeholder="Tambah Kategori" className="py-2 border px-3 rounded-lg" />
                        <TagsInputDropdown
                            onSelect={(suggestion) => {
                                if (!categories.includes(suggestion)) {
                                    setCategories([...categories, suggestion]);
                                }
                            }}
                        />
                    </TagsInputList>
                </TagsInput>
            </div>
            <div className="flex flex-1 items-center justify-end w-full px-4 py-3 border-t border-dashed gap-2">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setEdit(!edit)}>
                            {edit ? (
                                <span>Batal</span>
                            ) : (
                                <>
                                    <Trash />
                                    <span>Ubah</span>
                                </>
                            )}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Ubah Categories</p>
                    </TooltipContent>
                </Tooltip>
                {edit && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size="sm"
                                onClick={() => handleSaveCategories()}
                            >
                                <Save />
                                <span>Simpan</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Simpan Perubahan</p>
                        </TooltipContent>
                    </Tooltip>
                )}
            </div>
        </div>
    )
}