/*
	New compiled engine asm.js
	experimental
*/

#include <queue>
#include <iostream>

namespace std;




int main() {

	priority_queue<string> queue;

	string a = "test";
	queue.push(a);
	while(!queue.empty()) {
		cout << queue.pop();
	}

}