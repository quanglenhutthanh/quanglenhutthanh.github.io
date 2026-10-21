---
title: "Apriori & đếm support bằng hash tree"
subject: "data-mining"
type: lecture
lecture_no: 5
status: done
source: note
tags: [frequent-itemset, association-rules, apriori, hash-tree, support-counting]
date: 2026-10-21
resources:
  - ../assets/hash-tree-sim.html
---

# Apriori & đếm support bằng hash tree

**Apriori** (Agrawal & Srikant, 1994) là thuật toán kinh điển tìm mọi **frequent itemset** theo kiểu **sinh ứng viên rồi kiểm tra** (*generate-and-test*), đi **từng mức** (*level-wise*): từ itemset 1 phần tử lên 2, 3… phần tử. Phần tốn kém nhất của mỗi mức là **đếm support** cho các ứng viên.

**Hash tree là một cải tiến của Apriori**, nhắm đúng vào bước đếm đó: cất các ứng viên vào một cây có ngăn, để mỗi giao dịch chỉ phải so với vài ngăn liên quan thay vì toàn bộ ứng viên. Kết quả của Apriori không đổi; chỉ có bước đếm nhanh hơn (§4–§5).

Note này dùng **cùng database** với note [FP-growth](fp-growth.md), nên hai thuật toán có thể đối chiếu trực tiếp: cả hai đều phải ra **18 frequent itemsets**.

## 1. Khái niệm và tính chất Apriori

| Ký hiệu | Nghĩa |
|---|---|
| $C_k$ | Tập **ứng viên** (*candidate*) $k$-itemset — có thể frequent |
| $L_k$ | Tập **frequent** $k$-itemset — support $\geq$ `min_sup` |
| Support của $X$ | Số giao dịch chứa toàn bộ $X$ |

**Tính chất Apriori** (*downward closure / anti-monotone*): **mọi tập con của một frequent itemset đều frequent**. Phát biểu ngược lại — dạng được dùng để cắt tỉa: nếu một itemset **không** frequent thì **mọi tập cha** của nó cũng không frequent.

Lý do: tập cha $Y \supseteq X$ chỉ xuất hiện trong những giao dịch đã chứa $X$, nên $\text{support}(Y) \leq \text{support}(X)$.

Nhờ tính chất này, ứng viên mức $k$ chỉ cần sinh ra từ $L_{k-1}$, không cần xét mọi tổ hợp item.

## 2. Thuật toán

```
L1 = {item có support ≥ min_sup}                     # quét DB lần 1
for k = 2, 3, ... while L(k-1) không rỗng:
    Ck = apriori_gen(L(k-1))                          # join + prune
    for mỗi giao dịch t trong DB:                     # quét DB lần k
        tăng count cho mọi candidate c ∈ Ck mà c ⊆ t   # ← bước tốn nhất; hash tree cải tiến ở đây
    Lk = {c ∈ Ck : count(c) ≥ min_sup}
return L1 ∪ L2 ∪ ...
```

### Sinh ứng viên: join + prune

Giữ mỗi itemset ở dạng **đã sắp xếp** (theo một thứ tự cố định, ví dụ bảng chữ cái).

1. **Join** ($L_{k-1} \bowtie L_{k-1}$): ghép hai itemset trong $L_{k-1}$ có **chung $k-2$ item đầu**, chỉ khác item cuối. Ví dụ với $k = 3$: $\{a, c\}$ và $\{a, f\}$ → $\{a, c, f\}$.
2. **Prune**: bỏ ứng viên nào có **một tập con $(k-1)$ phần tử không nằm trong $L_{k-1}$** — theo tính chất Apriori, nó chắc chắn không frequent, khỏi tốn công đếm.

Join theo prefix bảo đảm mỗi ứng viên được sinh **đúng một lần**; prune loại ứng viên mà không cần quét DB.

## 3. Ví dụ dùng xuyên suốt

Cùng 5 giao dịch với note FP-growth, `min_sup = 3`. Sắp item theo bảng chữ cái:

| TID | Items |
|---|---|
| T1 | a, c, d, f, g, i, m, p |
| T2 | a, b, c, f, l, m, o |
| T3 | b, f, h, j, o |
| T4 | b, c, k, p, s |
| T5 | a, c, e, f, l, m, n, p |

### Mức 1 — quét DB lần 1

$C_1$ là cả 17 item. Đếm support và giữ item $\geq 3$:

**$L_1$ = {a}:3, {b}:3, {c}:4, {f}:4, {m}:3, {p}:3** — 11 item còn lại bị loại (d, e, g, h, i, j, k, l, n, o, s).

### Mức 2 — quét DB lần 2

Join $L_1$ với chính nó → mọi cặp trong 6 item: $C_2$ có $\binom{6}{2} = 15$ ứng viên. Ở mức 2 prune không loại được gì (mọi tập con 1 phần tử đều nằm trong $L_1$).

| Ứng viên | Support | | Ứng viên | Support | | Ứng viên | Support |
|---|---|---|---|---|---|---|---|
| {a,b} | 1 | | {b,c} | 2 | | {c,m} | **3** |
| {a,c} | **3** | | {b,f} | 2 | | {c,p} | **3** |
| {a,f} | **3** | | {b,m} | 1 | | {f,m} | **3** |
| {a,m} | **3** | | {b,p} | 1 | | {f,p} | 2 |
| {a,p} | 2 | | {c,f} | **3** | | {m,p} | 2 |

**$L_2$ = {a,c}, {a,f}, {a,m}, {c,f}, {c,m}, {c,p}, {f,m}** — 7 itemset, đều có support 3. Không cặp nào chứa b đạt ngưỡng.

### Mức 3 — join + prune

**Join**: ghép các cặp trong $L_2$ có chung item đầu.

| Chung prefix | Các itemset trong $L_2$ | Ứng viên sinh ra |
|---|---|---|
| a | {a,c}, {a,f}, {a,m} | {a,c,f}, {a,c,m}, {a,f,m} |
| c | {c,f}, {c,m}, {c,p} | {c,f,m}, {c,f,p}, {c,m,p} |
| f | {f,m} | — (không có cặp để ghép) |

**Prune**: kiểm tra mọi tập con 2 phần tử.

| Ứng viên | Tập con 2 phần tử | Kết quả |
|---|---|---|
| {a,c,f} | {a,c} ✓ {a,f} ✓ {c,f} ✓ | giữ |
| {a,c,m} | {a,c} ✓ {a,m} ✓ {c,m} ✓ | giữ |
| {a,f,m} | {a,f} ✓ {a,m} ✓ {f,m} ✓ | giữ |
| {c,f,m} | {c,f} ✓ {c,m} ✓ {f,m} ✓ | giữ |
| {c,f,p} | {f,p} ✗ | **loại** — không cần đếm |
| {c,m,p} | {m,p} ✗ | **loại** |

$C_3$ còn 4 ứng viên; quét DB lần 3: cả 4 đều có support 3 → **$L_3$ = {a,c,f}, {a,c,m}, {a,f,m}, {c,f,m}**.

### Mức 4

Join: {a,c,f} và {a,c,m} chung prefix {a,c} → **{a,c,f,m}**. Prune: 4 tập con 3 phần tử {a,c,f}, {a,c,m}, {a,f,m}, {c,f,m} đều thuộc $L_3$ → giữ. Quét DB lần 4: support 3 → **$L_4$ = {a,c,f,m}**.

Mức 5: $L_4$ chỉ có một itemset nên không join được → $C_5$ rỗng, dừng.

### Tổng kết ví dụ

| Mức | Ứng viên đếm | Frequent |
|---|---|---|
| 1 | 17 | 6 |
| 2 | 15 | 7 |
| 3 | 4 (sinh 6, prune 2) | 4 |
| 4 | 1 | 1 |
| **Tổng** | **37** | **18** |

**18 frequent itemsets, 4 lần quét DB** — cùng kết quả với FP-growth (chỉ 2 lần quét, không sinh ứng viên). Với dữ liệu nhỏ như vậy chênh lệch không đáng kể; với dữ liệu thật, số ứng viên và số lần quét mới là vấn đề (xem §7).

## 4. Điểm yếu của Apriori: bước đếm support

Sinh ứng viên thì nhanh; thứ làm Apriori chậm là bước **đếm**. Ở mỗi mức, với **mỗi giao dịch** $t$, phải trả lời: *trong $C_k$, ứng viên nào nằm trọn trong $t$?* Dữ liệu thật có thể có hàng trăm nghìn ứng viên và hàng triệu giao dịch.

Hai cách đếm ngây thơ đều tệ:

| Cách | Chi phí mỗi giao dịch |
|---|---|
| So $t$ với **từng ứng viên** | $\lvert C_k \rvert$ phép kiểm tra tập con — $C_k$ có thể hàng trăm nghìn |
| Liệt kê **mọi tập con $k$ phần tử** của $t$ rồi tra từng cái | $\binom{\lvert t \rvert}{k}$ tập con — giao dịch 20 item, $k = 3$ đã là 1.140 |

> **Hash tree là cải tiến của Apriori ở đúng bước này.** Nó không thay đổi *kết quả* của Apriori (vẫn cùng ứng viên, cùng frequent itemset), cũng không giảm *số lần quét DB*. Nó chỉ làm cho **mỗi lần quét đếm nhanh hơn**: cất ứng viên vào một "tủ có ngăn", để mỗi giao dịch chỉ phải mở vài ngăn liên quan thay vì so với toàn bộ $C_k$.

Vị trí của hash tree trong vòng lặp của Apriori:

```
for k = 2, 3, ...:
    Ck = apriori_gen(L(k-1))           # sinh ứng viên (join + prune)
    tree = HashTree(Ck)                # ← xếp ứng viên vào tủ, một lần cho mỗi mức
    for mỗi giao dịch t trong DB:
        tree.count(t)                  # ← t chỉ mở các ngăn liên quan, +1 cho ứng viên khớp
    Lk = {c ∈ Ck : count(c) ≥ min_sup}
```

Lưu ý: hash tree **chứa ứng viên**, không chứa giao dịch. Giao dịch chỉ **đi qua** cây để đếm, không được thêm vào. Đây là điểm khác cơ bản với FP-tree của [FP-growth](fp-growth.md), nơi cây chứa chính các giao dịch đã nén.

## 5. Hash tree, từng bước

Ví dụ kinh điển của Tan, Steinbach & Kumar: 9 item đánh số 1–9 (mỗi số là một món hàng, chỉ là mã), 15 ứng viên 3-itemset, giao dịch $t = \{1, 2, 3, 5, 6\}$.

### Bước 1 — Chia item thành nhóm (hàm băm)

Để biết ứng viên cất vào ngăn nào, cần một quy tắc xếp **món → nhóm**. Ví dụ dùng hàm băm $h(p) = p \bmod 3$: lấy mã món chia 3, xem **số dư**.

| Món | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|
| Số dư khi chia 3 | 1 | 2 | 0 | 1 | 2 | 0 | 1 | 2 | 0 |
| Nhóm | **A** | **B** | **C** | **A** | **B** | **C** | **A** | **B** | **C** |

Chia 3 chỉ dư 0, 1 hoặc 2, nên luôn ra đúng 3 nhóm: **A = {1, 4, 7}**, **B = {2, 5, 8}**, **C = {3, 6, 9}**. Mỗi node của cây vì vậy có tối đa 3 nhánh.

Ba điều cần nhớ:

1. **Mỗi món luôn thuộc đúng một nhóm**, lần nào tính cũng ra như nhau — nên lúc cất và lúc tìm đi tới cùng một chỗ.
2. **Nhóm không có ý nghĩa về sản phẩm.** 1, 4, 7 chung nhóm chỉ vì cùng số dư. Đây thuần tuý là cách chia ngăn.
3. **Nhiều món chung một nhóm**, nên nhìn nhóm thì không biết chính xác là món nào. Vì vậy khi mở ngăn ra vẫn phải **kiểm tra lại từng ứng viên**.

Số nhóm là do người cài đặt chọn: `mod 3` vì đủ nhỏ để vẽ; dữ liệu thật hàng nghìn món có thể dùng `mod 100`. Nhiều nhóm → ngăn nhỏ, ít phải so khớp, nhưng cây tốn bộ nhớ hơn.

Mỗi ứng viên có thể viết thành **mã nhóm** bằng cách thay từng món bằng nhóm của nó, ví dụ {1 5 9} → **A-B-C**, {3 5 6} → **C-B-C**.

### Bước 2 — Ứng viên từ đâu ra

**Ứng viên** là nhóm món *có thể* phổ biến, chưa đếm nên chưa chắc. Trong thực tế, chúng được Apriori **sinh ra từ mức trước** bằng join + prune (§2–§3): ví dụ 5 giao dịch ở §3 sinh ra 4 ứng viên 3 món.

15 ứng viên dưới đây là **ví dụ do giáo trình cho sẵn** — đủ nhiều để cây phải tách ngăn vài lần, đủ ít để vẽ lên giấy. Hiểu là Apriori đã xong mức 2 và đang ở mức 3, cần đếm support cho:

$C_3$ = {1 4 5}, {1 2 4}, {4 5 7}, {1 2 5}, {4 5 8}, {1 5 9}, {1 3 6}, {2 3 4}, {5 6 7}, {3 4 5}, {3 5 6}, {3 5 7}, {6 8 9}, {3 6 7}, {3 6 8}

(Với 9 món, số bộ ba tối đa là $\binom{9}{3} = 84$; 15 ứng viên nghĩa là mức 2 đã loại giúp 69 bộ ba khỏi phải đếm.)

### Bước 3 — Xếp từng ứng viên vào cây

**Quy tắc** (tham số `max_leaf = 3`):

1. **Root có sẵn 3 nhánh A, B, C.** Tại root, nhìn **món thứ 1** của ứng viên để chọn nhánh.
2. Có hai loại ngăn:

   | Gặp ngăn… | Làm gì |
   |---|---|
   | **Chưa chia** (lá) | **Bỏ ứng viên vào.** |
   | **Đã chia** (node trong) | Không chứa ứng viên, chỉ là **biển chỉ đường**: nhìn **món kế tiếp** để chọn ngăn con, rồi đi tiếp. |

3. Ngăn chưa chia nào bị **quá 3** ứng viên thì **chia** ngăn đó thành 3 ngăn con A, B, C, và chuyển mọi ứng viên trong ngăn xuống theo **món kế tiếp**: ngăn ở tầng 1 chia theo món thứ 2, ngăn ở tầng 2 chia theo món thứ 3.
4. Chỉ chia **khi thật sự tràn** — không chia sẵn. Chia sẵn đủ 3 tầng sẽ là $3^3 = 27$ ngăn cho 15 ứng viên, phần lớn rỗng; với dữ liệu thật thì không bộ nhớ nào chứa nổi.
5. Không chia sâu quá $k$ tầng: ứng viên chỉ có $k$ món, hết món để nhìn thì ngăn được phép chứa quá `max_leaf`.

**Địa chỉ ngăn** ghi lại đường đi: **A-C** đọc là "trong ngăn A, lấy ngăn con C". Chữ thứ nhất là nhánh chọn ở root (theo món 1), chữ thứ hai là nhánh chọn bên trong (theo món 2)…

Tủ lúc đầu: `root → A: [ ]   B: [ ]   C: [ ]`

**Ứng viên 1–3: {1 4 5}, {1 2 4}, {4 5 7}.** Món thứ 1 lần lượt là 1, 1, 4 — đều thuộc **A** (4 khác 1 nhưng **cùng nhóm**). Ngăn A chưa chia, còn chỗ → bỏ vào. A có 3, vừa đủ.

**Ứng viên 4: {1 2 5} — ngăn A tràn.** Món 1 là 1 → A. Bỏ vào thì A có 4 > 3 → **chia ngăn A theo món thứ 2**:

| Ứng viên | Món thứ 2 | Nhóm | Sang ngăn |
|---|---|---|---|
| {1 4 5} | 4 | A | A-A |
| {1 2 4} | 2 | B | A-B |
| {4 5 7} | 5 | B | A-B |
| {1 2 5} | 2 | B | A-B |

A-A có 1, A-B có 3, A-C rỗng (chưa ai có món 2 thuộc nhóm C). Từ giờ ngăn **A là ngăn đã chia**: không chứa ứng viên nữa.

```
root
├─ A                    ← đã chia
│  ├─ A: [145]
│  ├─ B: [124, 457, 125]
│  └─ C: [ ]
├─ B: [ ]
└─ C: [ ]
```

**Ứng viên 5: {4 5 8} — ngăn A-B tràn.** Món 1 là 4 → A (đã chia, đi tiếp); món 2 là 5 → B → A-B. Bỏ vào thì A-B có 4 → **chia ngăn A-B theo món thứ 3** (món 1 đã dùng ở root, món 2 đã dùng ở ngăn A):

| Ứng viên | Món thứ 3 | Nhóm | Sang ngăn |
|---|---|---|---|
| {1 2 4} | 4 | A | A-B-A |
| {4 5 7} | 7 | A | A-B-A |
| {1 2 5} | 5 | B | A-B-B |
| {4 5 8} | 8 | B | A-B-B |

```
root
├─ A                    ← đã chia
│  ├─ A: [145]
│  ├─ B                 ← đã chia
│  │  ├─ A: [124, 457]
│  │  ├─ B: [125, 458]
│  │  └─ C: [ ]
│  └─ C: [ ]
├─ B: [ ]
└─ C: [ ]
```

**Ứng viên 6: {1 5 9}.** Đây là ví dụ rõ nhất của "đã chia, đi tiếp":

1. Ở root, món 1 là **1** → A. Ngăn A **đã chia** → không bỏ vào được, phải chọn ngăn con.
2. Trong A, món 2 là **5** → B → A-B. Ngăn A-B cũng **đã chia** → lại chọn ngăn con.
3. Trong A-B, món 3 là **9** → C → **A-B-C**. Ngăn này **chưa chia** (đang rỗng) → bỏ vào.

Giống tìm phòng trong một toà nhà: tới toà A chưa phải chỗ ở, phải chọn tầng; tới tầng B vẫn chưa, phải chọn phòng; tới phòng C mới vào được.

**Ứng viên 7: {1 3 6}.** Món 1 là 1 → A (đã chia, đi tiếp); món 2 là **3** → nhóm C → ngăn **A-C**. A-C **chưa chia** nên bỏ vào luôn — **không cần nhìn món 3**. Đây là ứng viên đầu tiên vào A-C.

**Ứng viên 8–9: {2 3 4}, {5 6 7}.** Món 1 là 2 và 5, đều thuộc **B** → ngăn B. Chỉ có 2 ứng viên, không bao giờ tràn → ngăn B **không bao giờ bị chia**.

**Ứng viên 10–12: {3 4 5}, {3 5 6}, {3 5 7}.** Món 1 đều là 3 → **C**. Ngăn C có 3, vừa đủ.

**Ứng viên 13: {6 8 9} — ngăn C tràn.** Món 1 là 6 → C, ngăn C có 4 → **chia ngăn C theo món thứ 2**:

| Ứng viên | Món thứ 2 | Nhóm | Sang ngăn |
|---|---|---|---|
| {3 4 5} | 4 | A | C-A |
| {3 5 6} | 5 | B | C-B |
| {3 5 7} | 5 | B | C-B |
| {6 8 9} | 8 | B | C-B |

**Ứng viên 14–15: {3 6 7}, {3 6 8}.** Món 1 là 3 → C (đã chia, đi tiếp); món 2 là 6 → C → ngăn **C-C**, có 2.

**Cây hoàn chỉnh** — 15 ứng viên trong 9 ngăn, chỉ có 3 lần chia (A, A-B, C):

```
root                        (chọn nhánh theo món 1)
├─ A                        (đã chia: chọn theo món 2)
│  ├─ A: [145]
│  ├─ B                     (đã chia: chọn theo món 3)
│  │  ├─ A: [124, 457]
│  │  ├─ B: [125, 458]
│  │  └─ C: [159]
│  └─ C: [136]
├─ B: [234, 567]
└─ C                        (đã chia: chọn theo món 2)
   ├─ A: [345]
   ├─ B: [356, 357, 689]
   └─ C: [367, 368]
```

Đọc địa chỉ ngăn của một ứng viên:

| Ứng viên | Món 1 → nhóm | Món 2 → nhóm | Món 3 → nhóm | Ngăn |
|---|---|---|---|---|
| {1 4 5} | 1 → A | 4 → A | (không cần) | **A-A** |
| {1 3 6} | 1 → A | 3 → C | (không cần) | **A-C** |
| {1 5 9} | 1 → A | 5 → B | 9 → C | **A-B-C** |
| {2 3 4} | 2 → B | (không cần) | | **B** |
| {3 6 7} | 3 → C | 6 → C | (không cần) | **C-C** |

Số chữ trong địa chỉ = số tầng ứng viên phải đi qua. Chỉ đi tiếp khi gặp ngăn đã chia, nên **cây không đều**: nhánh A sâu 3 tầng vì nhiều ứng viên bắt đầu bằng 1 và 4; nhánh B chỉ 1 tầng.

*Quy ước khác:* một số tài liệu cho root **bắt đầu là một ngăn** (chưa chia), tràn mới chia — trong code ở §6 là đổi `{} if depth == 0 else None` thành `None`. Với ví dụ này cả hai cách cho ra **cùng một cây cuối cùng**.

### Bước 4 — Cho giao dịch đi qua cây để đếm

Giao dịch $t = \{1, 2, 3, 5, 6\}$ có mã nhóm: 1 → A, 2 → B, 3 → C, 5 → B, 6 → C. Câu hỏi: **ứng viên nào nằm trọn trong $t$?**

Cách hiểu đơn giản nhất: liệt kê cả $\binom{5}{3} = 10$ tập con 3 phần tử của $t$, đổi sang mã nhóm, xem mỗi tập con **trỏ tới ngăn nào**, rồi mở ngăn đó ra so:

| Tập con của $t$ | Mã | Mở ngăn | Trong ngăn có | Khớp? |
|---|---|---|---|---|
| 1 2 3 | A B C | **A-B-C** | 159 | ✗ (chỉ trùng mã, khác món) |
| 1 2 5 | A B B | **A-B-B** | 125, 458 | **125 ✓** |
| 1 2 6 | A B C | A-B-C | *đã mở rồi — bỏ qua* | |
| 1 3 5 | A C … | **A-C** | 136 | **136 ✓** |
| 1 3 6 | A C … | A-C | *đã mở rồi — bỏ qua* | |
| 1 5 6 | A B C | A-B-C | *đã mở rồi — bỏ qua* | |
| 2 3 5 | B … | **B** | 234, 567 | ✗ ✗ |
| 2 3 6 | B … | B | *đã mở rồi — bỏ qua* | |
| 2 5 6 | B … | B | *đã mở rồi — bỏ qua* | |
| 3 5 6 | C B … | **C-B** | 356, 357, 689 | **356 ✓** |

"…" nghĩa là ngăn đó không chia sâu hơn, nên 1–2 chữ đầu là đủ để biết ngăn.

**Kết quả cho giao dịch này:**

- Chỉ mở **5 / 9 ngăn**: A-B-C, A-B-B, A-C, B, C-B.
- 4 ngăn **không bao giờ đụng tới**: A-A, A-B-A, C-A, C-C — không tập con nào của $t$ trỏ vào đó → bỏ qua 6 ứng viên mà không cần so.
- So khớp **9 / 15 ứng viên**, tìm ra **3 cái khớp**: {1 2 5}, {1 3 6}, {3 5 6} → mỗi cái **+1 support**.

Lặp lại với mọi giao dịch trong DB là xong một lần quét của Apriori ở mức 3. Với 15 ứng viên thì tiết kiệm 6 phép so; với $10^5$ ứng viên phân vào hàng nghìn ngăn, mỗi giao dịch chỉ chạm một phần rất nhỏ — đó là cải tiến mà hash tree mang lại.

**Hai điểm dễ sai:**

1. **Vào đúng ngăn vẫn phải so khớp.** Mã nhóm làm mất thông tin: {1 2 3} và {1 5 9} cùng mã A-B-C (2 và 5 cùng nhóm B, 3 và 9 cùng nhóm C). Ngăn chỉ cho biết "*có thể* khớp".
2. **Một ngăn có thể bị trỏ tới nhiều lần.** {1 2 3}, {1 2 6}, {1 5 6} đều trỏ vào A-B-C. Nếu lần nào cũng so và cộng, một ứng viên khớp ở đó sẽ bị **đếm nhiều lần cho cùng một giao dịch**. Cài đặt đúng phải **nhớ ngăn đã mở** trong mỗi giao dịch. Một số giáo trình báo "11 phép so khớp" cho ví dụ này — con số đó tính cả các lần mở lại ngăn A-B-C.

**Trong code, cây liệt kê tập con thông minh hơn**: thay vì sinh đủ 10 tập con, nó đi xuống cây theo **tiền tố** và dừng ngay khi tới lá. Ở root, món đầu chỉ có thể là 1, 2 hoặc 3 (sau 5 chỉ còn 1 món, không đủ cho tập 3 phần tử); ở mỗi tầng chỉ lấy các món **đứng sau** món vừa chọn.

| Tiền tố | Đường đi | Ngăn tới | Gộp các tập con |
|---|---|---|---|
| 1 + 2 + 3 | A → B → C | A-B-C | 123 |
| 1 + 2 + 5 | A → B → B | A-B-B | 125 |
| 1 + 2 + 6 | A → B → C | A-B-C (mở lại) | 126 |
| 1 + 3 | A → C | A-C | 135, 136 |
| 1 + 5 + 6 | A → B → C | A-B-C (mở lại) | 156 |
| 2 | B | B | 235, 236, 256 |
| 3 + 5 | C → B | C-B | 356 |

Tiền tố `2` tới ngăn B ngay ở tầng 1 nên gộp luôn ba tập con 235, 236, 256 làm một lần mở. Bản chất vẫn là bảng 10 tập con ở trên.

### Mô phỏng từng bước

Bấm **Bước tiếp →**: các bước đầu xếp từng ứng viên vào cây (xanh: đường đi khi chèn, cam: ngăn vừa chia), các bước sau cho giao dịch {1 2 3 5 6} đi qua cây (tím: đường đi, xanh lá: ứng viên khớp). Nhánh trên cây được ghi là A / B / C như trong bài.

<iframe src="../assets/hash-tree-sim.html" width="100%" height="760" style="border:1px solid #ddd;border-radius:8px" title="Hash tree simulator"></iframe>

### Các tham số ảnh hưởng hiệu năng

- **Số nhóm của hàm băm**: nhiều nhóm → ngăn nhỏ hơn, ít so khớp hơn, nhưng cây to hơn và mỗi giao dịch đi nhiều đường hơn.
- **`max_leaf`**: nhỏ → cây sâu, so khớp ít; lớn → cây nông, so khớp nhiều ở mỗi ngăn.
- **Độ dài giao dịch**: giao dịch dài có nhiều tập con → mở nhiều ngăn. Hash tree hiệu quả nhất khi giao dịch ngắn so với số ứng viên.

## 6. Cài đặt bằng Python

### Apriori

```python
from itertools import combinations
from collections import defaultdict

def apriori_gen(L_prev, k):
    """Join + prune: sinh C_k từ L_{k-1} (mỗi itemset là tuple đã sắp)."""
    L_prev = sorted(L_prev)
    S = set(L_prev)
    C = []
    for i in range(len(L_prev)):
        for j in range(i + 1, len(L_prev)):
            a, b = L_prev[i], L_prev[j]
            if a[:k-2] != b[:k-2]:             # join: chung k-2 item đầu
                break                          # đã sắp nên các b sau cũng không chung prefix
            c = a + (b[-1],)
            if all(s in S for s in combinations(c, k - 1)):   # prune
                C.append(c)
    return C

def apriori(D, min_sup):
    D = [set(t) for t in D]
    cnt = defaultdict(int)
    for t in D:                                # quét DB lần 1
        for x in t:
            cnt[(x,)] += 1
    L = {c: n for c, n in cnt.items() if n >= min_sup}
    result, k = dict(L), 2
    while L:
        C = apriori_gen(L, k)
        cnt = {c: sum(set(c) <= t for t in D) for c in C}   # quét DB lần k (đếm ngây thơ)
        L = {c: n for c, n in cnt.items() if n >= min_sup}
        result.update(L)
        k += 1
    return result

D = ["facdgimp", "abcflmo", "bfhjo", "bcksp", "afcelpmn"]
print(len(apriori(D, min_sup=3)))   # 18
```

### Hash tree

```python
class HashTree:
    def __init__(self, k, max_leaf=3, depth=0):
        self.k, self.max_leaf, self.depth = k, max_leaf, depth
        # None = ngăn chưa chia (lá); dict nhóm -> HashTree = ngăn đã chia (node trong).
        # Root có sẵn các nhánh; ngăn khác chỉ chia khi tràn.
        self.children = {} if depth == 0 else None
        self.bucket = []                       # ứng viên lưu ở lá

    @staticmethod
    def h(item):
        return item % 3                        # nhóm A = {1,4,7} -> 1 | B = {2,5,8} -> 2 | C = {3,6,9} -> 0

    def insert(self, c):
        if self.children is not None:          # node trong: băm item thứ `depth` của ứng viên
            b = self.h(c[self.depth])
            if b not in self.children:
                self.children[b] = HashTree(self.k, self.max_leaf, self.depth + 1)
            self.children[b].insert(c)
            return
        self.bucket.append(c)
        if len(self.bucket) > self.max_leaf and self.depth < self.k:   # lá tràn -> tách
            old, self.bucket, self.children = self.bucket, [], {}
            for x in old:
                self.insert(x)

    def leaves_for(self, t, start=0, out=None):
        """Các lá mà giao dịch t (đã sắp) có thể chứa ứng viên — mỗi lá một lần."""
        out = {} if out is None else out
        if self.children is None:
            out[id(self)] = self
            return out
        for i in range(start, len(t) - (self.k - self.depth) + 1):    # chừa đủ item cho các mức sau
            child = self.children.get(self.h(t[i]))
            if child:
                child.leaves_for(t, i + 1, out)
        return out

    def count(self, t, counts):
        ts = set(t)
        for leaf in self.leaves_for(sorted(t)).values():
            for c in leaf.bucket:
                if ts.issuperset(c):
                    counts[c] = counts.get(c, 0) + 1

C3 = [(1,4,5), (1,2,4), (4,5,7), (1,2,5), (4,5,8), (1,5,9), (1,3,6), (2,3,4),
      (5,6,7), (3,4,5), (3,5,6), (3,5,7), (6,8,9), (3,6,7), (3,6,8)]
tree = HashTree(k=3)
for c in C3:
    tree.insert(c)
counts = {}
tree.count((1, 2, 3, 5, 6), counts)
print(counts)   # {(1, 2, 5): 1, (1, 3, 6): 1, (3, 5, 6): 1}
```

Hàm `leaves_for` gom lá vào dict theo `id` — đó chính là bước **chống đếm trùng** ở §5. Hai đoạn code ghép với nhau bằng cách thay dòng đếm ngây thơ trong `apriori` bằng: dựng `HashTree` từ `C`, rồi gọi `tree.count(t, cnt)` cho mỗi giao dịch (item cần là số nguyên, hoặc đổi `h` thành `hash(item) % 3`).

Dùng thư viện: `mlxtend.frequent_patterns.apriori(df, min_support=0.6, use_colnames=True)` với cùng cách mã hoá one-hot như ở note FP-growth.

## 7. Ưu, nhược điểm và cải tiến

**Nhược điểm** của Apriori:

- **Quét DB nhiều lần**: $k$ lần cho itemset dài nhất $k$ phần tử.
- **Số ứng viên bùng nổ**: $10^4$ item frequent → khoảng $5 \times 10^7$ ứng viên 2 phần tử; một frequent itemset 100 phần tử kéo theo $2^{100} - 1$ tập con frequent phải sinh ra.
- **Đếm support tốn kém**: mỗi lần quét, mỗi giao dịch phải kiểm tra với rất nhiều ứng viên.

**Cải tiến**: mỗi kỹ thuật nhắm vào một điểm yếu ở trên.

| Kỹ thuật | Cải tiến điểm nào | Ý tưởng |
|---|---|---|
| **Hash tree** (§5) | Đếm support | Cất ứng viên vào cây có ngăn theo hàm băm; mỗi giao dịch chỉ mở các ngăn mà tập con của nó trỏ tới |
| **Hash-based** (DHP) | Số ứng viên | Khi quét mức $k$, băm luôn các $(k+1)$-itemset vào bucket; bucket nào tổng count < `min_sup` thì loại sớm ứng viên tương ứng — hiệu quả nhất ở mức 2 |
| **Transaction reduction** | Đếm support | Giao dịch không chứa frequent $k$-itemset nào thì bỏ khỏi các lần quét sau |
| **Partitioning** | Số lần quét | Chia DB thành phần vừa RAM; itemset frequent toàn cục phải frequent ở ít nhất một phần → chỉ 2 lần quét |
| **Sampling** | Số lần quét | Khai phá trên mẫu với ngưỡng thấp hơn, rồi kiểm tra lại trên toàn DB |
| **Dynamic itemset counting** | Số lần quét | Bắt đầu đếm ứng viên mức mới ngay giữa lần quét, không đợi hết mức hiện tại |

Hash tree và DHP đều dùng hàm băm nhưng khác mục đích: hash tree **đếm nhanh** các ứng viên đã có; DHP **loại bớt** ứng viên trước khi đếm.

Hướng triệt để nhất là **bỏ hẳn việc sinh ứng viên**: [FP-growth](fp-growth.md) nén DB vào FP-tree và chỉ quét 2 lần.

| | Apriori | FP-growth |
|---|---|---|
| Chiến lược | Sinh ứng viên + kiểm tra, theo từng mức | Chia để trị trên FP-tree |
| Số lần quét DB (ví dụ) | 4 | 2 |
| Cấu trúc chính | Hash tree chứa ứng viên | FP-tree chứa giao dịch đã nén |
| Điểm nghẽn | Số ứng viên, số lần quét | Bộ nhớ cho cây |
| Ưu điểm | Đơn giản, dễ cài đặt, dễ song song hoá theo từng mức | Nhanh hơn nhiều với dữ liệu dày, `min_sup` thấp |

## 8. Tóm tắt

- **Tính chất Apriori**: tập con của frequent itemset cũng frequent → tập cha của itemset không frequent cũng không frequent.
- Đi từng mức: $L_{k-1}$ → **join** (chung $k-2$ item đầu) → **prune** (mọi tập con $k-1$ phải thuộc $L_{k-1}$) → $C_k$ → quét DB đếm support → $L_k$.
- **Hash tree là cải tiến cho bước đếm support của Apriori**: kết quả không đổi, mỗi lần quét nhanh hơn.
  - **Chia nhóm**: hàm băm xếp mỗi món vào một nhóm (ví dụ `mod 3` → A, B, C).
  - **Xếp ứng viên**: đi xuống cây theo nhóm của món 1, 2, 3…; ngăn đã chia thì đi tiếp, ngăn chưa chia thì bỏ vào; ngăn quá `max_leaf` thì chia theo món kế tiếp.
  - **Đếm**: mỗi giao dịch chỉ mở các ngăn mà tập con của nó trỏ tới; mở ra vẫn phải so khớp; mỗi ngăn chỉ mở một lần mỗi giao dịch để không đếm trùng.
- Ví dụ: 37 ứng viên qua 4 lần quét → 18 frequent itemsets, giống FP-growth.
