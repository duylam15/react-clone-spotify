export interface Playlist {
  danh_sach_phat_id: string;
  order: number;
  ten_danh_sach: string;
  anh_danh_sach: string;
  followers: number;
  description?: string;
}

export interface Song {
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
