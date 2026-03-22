'use client';

import { TagsInput, TagsInputClear, TagsInputInput, TagsInputItem, TagsInputLabel, TagsInputList, TagsInputDropdown } from "@/components/ui/tags-input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { X, Trash, Save } from 'lucide-react';
import Required from "@/components/partials/Required";
import { Button } from "@/components/ui/button";
import { useModule } from "@/contexts/ModuleContext";
import { useEffect, useState } from "react";

export const ModuleCategories = () => {
    const { category, module, setModuleTemp } = useModule();
    const [categories, setCategories] = useState(module?.categories?.map(c => c.name) ?? []);
    const [lastSavedCategories, setLastSavedCategories] = useState(module?.categories?.map(c => c.name) ?? []);
    const [edit, setEdit] = useState(false);

    const originalCategories = module?.categories?.map(c => c.name) ?? [];
    const hasChangedFromLastSaved = JSON.stringify(categories) !== JSON.stringify(lastSavedCategories);
    const showSaveButton = hasChangedFromLastSaved;

    // Filter out already-added categories from suggestions
    const filteredSuggestions = category
        ?.map(c => c.name)
        ?.filter(name => !categories.includes(name));

    const handleSaveCategories = () => {
        setLastSavedCategories([...categories]);
        setModuleTemp(prev => ({
            ...prev,
            categories: categories
        }));
    }

    const handleCancel = () => {
        setCategories([...originalCategories]);
    }


    return (
        <div className='rounded-xl bg-card text-card-foreground shadow-sm'>
            <div className='flex flex-col p-4'>
                <h4 className='font-semibold text-sm'>Categories <Required /></h4>
                <p className='text-xs text-muted-foreground'>Tentukan kategori untuk materi</p>
            </div>
            <div className='border-t border-dashed border-border px-4 py-3 flex flex-col gap-2'>
                <TagsInput
                    value={categories}
                    onValueChange={setCategories}
                    editable={edit}
                    addOnPaste
                    suggestions={filteredSuggestions}
                >
                    <TagsInputList className="rounded-xl border-0 p-0 focus-visible:outline-none focus-within:ring-0 gap-2">
                        {(categories?.length === 0 && !edit) ? (
                            <div className="flex items-center justify-center w-full">
                                <p className="text-muted-foreground">Belum ada categories</p>
                            </div>
                        ) : categories.map((category) => (
                            <TagsInputItem key={category} value={category} className="rounded-lg bg-muted text-xs">
                                {category}
                            </TagsInputItem>
                        ))}
                        <TagsInputInput placeholder="Tambah Kategori ..." className="px-3 rounded-lg text-xs" />
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
            <div className="flex flex-1 items-center justify-end w-full px-4 py-3 border-t border-dashed border-border gap-2">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => {
                            setEdit(!edit);
                            if (edit) {
                                handleCancel();
                            }
                        }}>
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
                {(showSaveButton) && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size="sm"
                                onClick={handleSaveCategories}
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
