/**
 * Generate slug URL yang valid dari sebuah title
 * @param {string} title - Title yang akan diconvert menjadi slug
 * @param {object} options - Opsi konfigurasi
 * @param {string} options.separator - Karakter pemisah (default: '-')
 * @param {boolean} options.lowercase - Convert ke lowercase (default: true)
 * @param {number} options.maxLength - Panjang maksimal slug (default: null)
 * @returns {string} Slug URL yang valid
 */
export function generateSlug(title, options = {}) {
    const {
        separator = '-',
        lowercase = true,
        maxLength = null
    } = options;

    if (!title || typeof title !== 'string') {
        return '';
    }

    let slug = title.trim();

    // Convert ke lowercase jika diminta
    if (lowercase) {
        slug = slug.toLowerCase();
    }

    // Hapus karakter aksen dan diacritics
    slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // Replace spasi dan karakter khusus dengan separator
    slug = slug
        .replace(/[^\w\s-]/g, '') // Hapus karakter selain word, space, dan dash
        .replace(/[\s_]+/g, separator) // Replace spasi dan underscore dengan separator
        .replace(new RegExp(`${separator}+`, 'g'), separator); // Replace multiple separator jadi satu

    // Hapus separator di awal dan akhir
    slug = slug.replace(new RegExp(`^${separator}+|${separator}+$`, 'g'), '');

    // Limit panjang jika maxLength ditentukan
    if (maxLength && slug.length > maxLength) {
        slug = slug.substring(0, maxLength);
        // Pastikan tidak berakhir dengan separator
        slug = slug.replace(new RegExp(`${separator}+$`), '');
    }

    return slug;
}