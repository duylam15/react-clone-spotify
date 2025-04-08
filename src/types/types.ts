export interface Playlist {
    danh_sach_phat_id: number;
    album_id: number;
    order?: number;
    ten_danh_sach: string;
    anh_danh_sach: string;
    followers?: number;
    description?: string;
}

export interface Song {
    album_id: number;
    bai_hat_id: number;
    ten_bai_hat: string;
    nghe_si: string;
    ten_album: string;
    the_loai: string;
    duong_dan: string;
    loi_bai_hat: string;
    thoi_luong: number;
    ngay_phat_hanh: string;
}

export interface Artist {
    nghe_si_id: number;
    ten_nghe_si: string;
    tieu_su: string;
    anh_dai_dien: string;
    ngay_sinh: string;
    quoc_gia: string;
    created_at: string;
    updated_at: string;
}

export type Album = {
    album_id: number;
    ten_album: string;
    anh_bia: string;
    ngay_phat_hanh: string;
    the_loai: string;
    created_at: string;
    updated_at: string;
    nghe_si_id: number;
};
