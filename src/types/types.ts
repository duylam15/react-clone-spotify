export interface Playlist {
  id: string;
  order: number;
  title: string;
  image: string;
  followers: number;
  description?: string;
}


export interface Song {
  bai_hat_id: number;
  ten_bai_hat: string;
  nghe_si: string;
  ten_album : string;
  the_loai: string;
  duong_dan: string;
  loi_bai_hat: string;
  thoi_luong: number;
  ngay_phat_hanh: string;
  
}