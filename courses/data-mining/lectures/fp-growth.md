---
title: "FP-growth: khai phá tập phổ biến không sinh ứng viên"
subject: "data-mining"
type: lecture
lecture_no: 6
status: done
source: note
tags: [frequent-itemset, association-rules, fp-growth, fp-tree, apriori]
date: 2026-10-21
resources:
  - ../assets/fp-growth-sim.html
---

# FP-growth: khai phá tập phổ biến không sinh ứng viên

**FP-growth** (*Frequent Pattern growth*, Han, Pei & Yin, 2000) tìm mọi **frequent itemset** — các tập item xuất hiện cùng nhau trong ít nhất `min_sup` giao dịch — mà **không sinh tập ứng viên** như [Apriori](apriori-hash-tree.md). Ý tưởng: nén toàn bộ database vào một cây prefix gọi là **FP-tree** (chỉ cần **2 lần quét DB**), rồi khai phá trực tiếp trên cây bằng chiến lược **chia để trị**.

Frequent itemset là đầu vào để sinh **luật kết hợp** (*association rules*) kiểu `{tã} ⇒ {sữa}` — tác vụ mô tả kinh điển của data mining (xem [Dữ liệu → Thông tin → Tri thức](data-information-knowledge.md)).

## 1. Khái niệm

| Khái niệm | Nghĩa |
|---|---|
| **Itemset** | Một tập item, ví dụ $\{f, c, a\}$ |
| **Support** của $X$ | Số giao dịch chứa toàn bộ $X$ (hoặc tỷ lệ) |
| **Frequent itemset** | Itemset có support $\geq$ `min_sup` |
| **F-list** | Danh sách item frequent, **sắp giảm dần theo support** |

Tính chất nền tảng (*Apriori / downward closure*): mọi tập con của một frequent itemset cũng frequent. Nếu $\{a\}$ không frequent thì không tập nào chứa $a$ frequent — nên ngay từ đầu có thể bỏ hẳn các item không frequent.

## 2. Ví dụ dùng xuyên suốt

5 giao dịch, `min_sup = 3`:

| TID | Items |
|---|---|
| T1 | f, a, c, d, g, i, m, p |
| T2 | a, b, c, f, l, m, o |
| T3 | b, f, h, j, o |
| T4 | b, c, k, s, p |
| T5 | a, f, c, e, l, p, m, n |

## 3. Bước 1 — Quét DB lần 1: đếm support, lập F-list

Đếm mỗi item xuất hiện trong bao nhiêu giao dịch, bỏ item có support < 3 (d, e, g, h, i, j, k, l, n, o, s), sắp phần còn lại giảm dần:

**F-list: f:4, c:4, a:3, b:3, m:3, p:3**

Khi hai item cùng support (f và c; a, b, m, p), thứ tự giữa chúng **tuỳ chọn** nhưng phải **cố định** trong suốt thuật toán — kết quả cuối cùng không đổi, chỉ hình dạng cây thay đổi.

## 4. Bước 2 — Quét DB lần 2: dựng FP-tree

Với mỗi giao dịch: **lọc** bỏ item không frequent, **sắp** theo thứ tự F-list, rồi **chèn** vào cây:

| TID | Sau khi lọc + sắp |
|---|---|
| T1 | f, c, a, m, p |
| T2 | f, c, a, b, m |
| T3 | f, b |
| T4 | c, b, p |
| T5 | f, c, a, m, p |

Quy tắc chèn: đi từ `root` theo các item của giao dịch. Nếu node con cho item đó **đã có** → đi theo và **cộng 1** vào count; nếu **chưa có** → **rẽ nhánh**, tạo node mới với count = 1.

| Chèn | Điều xảy ra |
|---|---|
| T1 `f,c,a,m,p` | Cây rỗng → tạo nhánh mới f:1 → c:1 → a:1 → m:1 → p:1 |
| T2 `f,c,a,b,m` | Prefix `f,c,a` trùng → f:2, c:2, a:2; tới b thì rẽ nhánh a → b:1 → m:1 |
| T3 `f,b` | f trùng → f:3; dưới f chưa có b → nhánh mới f → b:1 |
| T4 `c,b,p` | Không bắt đầu bằng f → nhánh mới từ root: c:1 → b:1 → p:1 |
| T5 `f,c,a,m,p` | Trùng hoàn toàn T1 → cộng dọc đường: f:4, c:3, a:3, m:2, p:2 |

Kết quả:

```
root
├─ f:4
│  ├─ c:3 ─ a:3 ─┬─ m:2 ─ p:2
│  │             └─ b:1 ─ m:1
│  └─ b:1
└─ c:1 ─ b:1 ─ p:1
```

**Header table**: mỗi item trong F-list có một con trỏ tới node đầu tiên của nó trong cây; các node cùng item được nối thành chuỗi bằng **node-link**. Ví dụ c có 2 node (`f→c:3` và `root→c:1`), b có 3 node, m và p mỗi item 2 node. Nhờ node-link, muốn lấy mọi chỗ xuất hiện của một item thì chỉ cần đi theo chuỗi, không phải duyệt cả cây.

Vì sao sắp theo support giảm dần: item phổ biến nằm gần root nên được **nhiều giao dịch dùng chung prefix** nhất → cây nhỏ nhất. Ở đây 5 giao dịch (tổng 20 item sau khi lọc) được nén thành **11 node**.

## 5. Bước 3 — Khai phá cây

Đi **từ dưới lên** theo F-list (p → m → b → a → c → f). Với mỗi item $x$:

1. **Conditional pattern base** của $x$: theo node-link lấy mọi node của $x$; với mỗi node, lấy **đường prefix** từ root tới ngay trước nó, gán count bằng **count của node $x$** đó.
2. **Conditional FP-tree** của $x$: đếm support các item trong pattern base, bỏ item < `min_sup`, dựng một FP-tree nhỏ từ base (giống bước 2, nhưng mỗi path có trọng số).
3. **Đệ quy**: mỗi frequent itemset tìm được trong conditional tree, ghép thêm $x$, là một frequent itemset. Khi conditional tree chỉ còn **một đường duy nhất** (*single path*), sinh luôn **mọi tổ hợp** các node trên đường đó mà không cần đệ quy tiếp.

Thứ tự bottom-up bảo đảm không trùng lặp: khi xét $x$, chỉ nhìn các item **đứng trước** $x$ trong F-list — các itemset chứa item đứng sau đã được tìm ở lượt trước.

| Item | Conditional pattern base | Đếm trong base | Conditional FP-tree | Frequent itemsets |
|---|---|---|---|---|
| p | {f,c,a,m}:2, {c,b}:1 | c:3, f:2, a:2, m:2, b:1 | ⟨c:3⟩ | {p}:3, {c,p}:3 |
| m | {f,c,a}:2, {f,c,a,b}:1 | f:3, c:3, a:3, b:1 | ⟨f:3, c:3, a:3⟩ — single path | {m}, {f,m}, {c,m}, {a,m}, {f,c,m}, {f,a,m}, {c,a,m}, {f,c,a,m} — tất cả :3 |
| b | {f,c,a}:1, {f}:1, {c}:1 | f:2, c:2, a:1 | rỗng | {b}:3 |
| a | {f,c}:3 | f:3, c:3 | ⟨f:3, c:3⟩ — single path | {a}:3, {f,a}:3, {c,a}:3, {f,c,a}:3 |
| c | {f}:3 (node `root→c:1` có prefix rỗng) | f:3 | ⟨f:3⟩ | {c}:4, {f,c}:3 |
| f | rỗng (f nằm ngay dưới root) | — | — | {f}:4 |

Chú ý trường hợp **m**: dù m có 2 node, prefix của chúng là `f,c,a` (count 2) và `f,c,a,b` (count 1). Sau khi bỏ b (support 1), cả hai gộp lại thành **một đường** f:3 → c:3 → a:3, nên mọi tập con của {f, c, a} ghép với m đều frequent: $2^3 = 8$ itemset.

Chú ý trường hợp **b**: support của {b} là 3, nhưng 3 lần xuất hiện nằm ở 3 nhánh khác nhau, không item nào đi cùng b đủ 3 lần.

Tổng cộng **18 frequent itemsets**: 6 itemset 1 phần tử, 7 itemset 2 phần tử, 4 itemset 3 phần tử ({f,c,a}, {f,c,m}, {f,a,m}, {c,a,m}), 1 itemset 4 phần tử ({f,c,a,m}) — trùng khớp với kết quả đếm vét cạn mọi tổ hợp.

### Mô phỏng từng bước

Bấm **Bước tiếp →** để xem cây được dựng qua từng giao dịch, rồi khai phá từng item (cam: item đang khai phá, tím: prefix path).

<iframe src="../assets/fp-growth-sim.html" width="100%" height="880" style="border:1px solid #ddd;border-radius:8px" title="FP-growth simulator"></iframe>

## 6. Cài đặt từ đầu bằng Python

```python
from collections import defaultdict

class Node:
    def __init__(self, item, parent):
        self.item, self.count, self.parent = item, 0, parent
        self.children = {}
        self.link = None                     # node-link tới node kế tiếp cùng item

def iter_links(node):
    while node:
        yield node
        node = node.link

def build_tree(transactions, min_sup):
    # Scan 1: đếm support, giữ item frequent, sắp giảm dần -> F-list
    sup = defaultdict(int)
    for t, cnt in transactions:
        for x in t:
            sup[x] += cnt
    flist = [x for x in sorted(sup, key=lambda x: -sup[x]) if sup[x] >= min_sup]
    rank = {x: r for r, x in enumerate(flist)}

    # Scan 2: lọc + sắp từng transaction theo F-list, chèn vào cây
    root, header = Node(None, None), {}
    for t, cnt in transactions:
        node = root
        for x in sorted((x for x in t if x in rank), key=rank.get):
            if x not in node.children:
                child = Node(x, node)
                node.children[x] = child
                child.link, header[x] = header.get(x), child   # nối vào header table
            node = node.children[x]
            node.count += cnt
    return flist, header

def fp_growth(transactions, min_sup, suffix=()):
    """transactions: list of (items, count). Trả về (itemset, support)."""
    flist, header = build_tree(transactions, min_sup)
    for item in reversed(flist):                       # bottom-up theo F-list
        new = (item,) + suffix
        yield new, sum(n.count for n in iter_links(header[item]))
        base = []
        for node in iter_links(header[item]):          # conditional pattern base
            path, p = [], node.parent
            while p.item is not None:                  # prefix path về root
                path.append(p.item)
                p = p.parent
            if path:
                base.append((path, node.count))
        yield from fp_growth(base, min_sup, new)       # conditional FP-tree, đệ quy

D = ["facdgimp", "abcflmo", "bfhjo", "bcksp", "afcelpmn"]
result = dict(fp_growth([(list(t), 1) for t in D], min_sup=3))
print(len(result))   # 18
```

Điểm mấu chốt: hàm `fp_growth` nhận đầu vào dạng **(items, count)**, nên cùng một hàm dùng được cho cả database gốc (mỗi giao dịch count = 1) lẫn conditional pattern base (mỗi path mang count của node). Cài đặt này không tách riêng trường hợp single path — đệ quy vẫn cho cùng kết quả, chỉ chậm hơn một chút.

Dùng thư viện:

```python
import pandas as pd
from mlxtend.preprocessing import TransactionEncoder
from mlxtend.frequent_patterns import fpgrowth, association_rules

te = TransactionEncoder()
df = pd.DataFrame(te.fit_transform([list(t) for t in D]), columns=te.columns_)
freq = fpgrowth(df, min_support=3/5, use_colnames=True)    # min_support là tỷ lệ
rules = association_rules(freq, metric="confidence", min_threshold=0.8)
```

Dữ liệu lớn: Spark MLlib `pyspark.ml.fpm.FPGrowth` (cài đặt PFP — Parallel FP-growth, chia F-list thành các nhóm và khai phá song song).

## 7. Từ frequent itemset tới luật kết hợp

Với frequent itemset $Z$ và mỗi cách tách $Z = X \cup Y$ ($X \cap Y = \varnothing$), luật $X \Rightarrow Y$ có:

$$
\text{confidence}(X \Rightarrow Y) = \frac{\text{support}(X \cup Y)}{\text{support}(X)}
\qquad
\text{lift}(X \Rightarrow Y) = \frac{\text{confidence}(X \Rightarrow Y)}{\text{support}(Y)/N}
$$

Ví dụ: $\{a\} \Rightarrow \{m\}$ có confidence $= 3/3 = 1$ — mọi giao dịch có a đều có m. $\{c\} \Rightarrow \{p\}$ có confidence $= 3/4 = 0{,}75$. Không cần quét lại DB: support của mọi tập con đã có sẵn trong kết quả FP-growth.

## 8. So với Apriori

| | Apriori | FP-growth |
|---|---|---|
| Chiến lược | Sinh ứng viên và kiểm tra (*generate-and-test*), theo từng mức $k$ | Chia để trị trên cây, không sinh ứng viên |
| Số lần quét DB | $k$ lần ($k$ = độ dài itemset dài nhất) | **2 lần** |
| Điểm nghẽn | Số ứng viên bùng nổ: $10^4$ item frequent → khoảng $5 \times 10^7$ ứng viên 2 phần tử | Bộ nhớ: FP-tree và các conditional tree phải nằm trong RAM |
| Hợp với | Dữ liệu nhỏ, `min_sup` cao, cần cài đặt đơn giản | Dữ liệu dày, nhiều prefix chung, `min_sup` thấp, itemset dài |

Điểm yếu của FP-growth: khi dữ liệu **thưa** (các giao dịch ít có prefix chung), cây nén kém, gần bằng database gốc mà còn tốn thêm con trỏ. Cách khắc phục: chiếu database thành nhiều phần nhỏ (*projected databases*) rồi khai phá từng phần, hoặc phân tán như PFP.

## 9. Tóm tắt

- **Scan 1**: đếm support, bỏ item < `min_sup`, sắp giảm dần → F-list.
- **Scan 2**: lọc + sắp từng giao dịch theo F-list, chèn vào FP-tree (prefix chung thì cộng count, khác thì rẽ nhánh); header table + node-link nối các node cùng item.
- **Khai phá** bottom-up: với mỗi item lấy conditional pattern base → dựng conditional FP-tree → đệ quy; single path thì sinh mọi tổ hợp.
- Không sinh ứng viên, chỉ 2 lần quét DB; đổi lại cần bộ nhớ cho cây.
