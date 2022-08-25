/*
01背包问题
题目:有N件物品和一个容量为V的背包。第i件物品的费用是c[i]，价值是w[i]。求解将哪些物品装入背包可使这些物品的费用总和不超过背包容量，且价值总和最大。
特点：每种物品仅有一件，可以选择放或不放。

输入格式：
N 物品数量
V 背包体系
goods N*2 的二维数组，每项两个正数v,w，表示物品的体积与价值

0 < N,V <= 1000
0 < v,w <= 1000
*/

export function main(N, V, goods) {
  let arr = new Array(V + 1).fill(0)
  for (let i = 0; i < N; i++) {
    let [v, w] = goods[i]
    for (let j = V; j >= v; j--) {
      arr[j] = Math.max(arr[j], arr[j - v] + w)
    }
  }
  console.log(arr[V])
  return arr[V]
}
