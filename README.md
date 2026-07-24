# Personal Site — Portfolio & Knowledge Base

Static site (Quarto) tổng hợp CV + kiến thức các môn thạc sĩ AI.

## Chạy local
```bash
quarto preview        # xem trực tiếp, tự reload
quarto render         # build ra _site/
```

## Cấu trúc
```
index.qmd            trang chủ (intro + CV)
about.qmd            CV chi tiết
courses/
  index.qmd          grid các môn (tự liệt kê)
  <mon>/
    index.qmd        trang môn (mục lục lecture tự sinh)
    lectures/*.md    note theo lecture (frontmatter đầy đủ)
    labs/*.ipynb     notebook để nguyên
    references.qmd   paper/link (không host file)
assets/              ảnh/CSS toàn site
```

## Thêm lecture mới
Bỏ file `L##-slug.md` vào `<mon>/lectures/` với frontmatter:
```yaml
title · subject · type · lecture_no · status · source · tags · date
```
Bảng mục lục ở `index.qmd` của môn sẽ tự cập nhật.

## Deploy
Push lên `main` → GitHub Actions build & publish lên nhánh `gh-pages`.
Nhớ bật Pages (Settings → Pages → branch `gh-pages`) và trỏ domain PA Vietnam.
