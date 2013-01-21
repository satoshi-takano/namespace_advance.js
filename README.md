namespace.js
======================
クラスベースのOOPに近い書き方ができるフレームワークをベースに、
主にWebサイト・サービスを実装するときに必要な機能を盛り込んだライブラリです。
JavaScript の学習も兼ねて作っているものです。

主な機能
===
配列や数値型の拡張、Ajaxラッパー、ActionScript3.0 に似たAPIのHTML Canvasライブラリと、表示オブジェクトのトランスフォームをサポートするジオメトリ関連機能、マウス・タッチイベントのディスパッチ機能などなど…



### OOPフレームワーク ###
	// プロトタイプの定義はすべて Namaspaceオブジェクトの
	// use メソッドに渡しされるクロージャ内で行います。
    new Namespace("jp.example").use(function() {
    
    // proto メソッドで prototype を定義します。
    // クラスベースOOP言語のクラス定義に近い役割のメソッドです。
    // proto は、use メソッドに渡されたクロージャ内でのみアクセスできます。
	proto(function Super() {
		// init に渡した無名関数（名前付きでも問題はありませんが、そうしても意味はありません）
		// はコンストラクタの役割を果たし、インスタンス化される際にフレームワークから呼び出されます。
		init(function(p0, p1) {
			this.propA = p0;
			this.propB = p1;
		});

		// def メソッドに名前付き関数を渡してメソッドを定義します。
		def(function inspect() {
			return "propA = " + this.propA + "\npropB = " + this.propB;
		});
	});

	// 上で定義した Super を継承した Sub を定義します。
	proto(function Sub() {
		// ex メソッドに親プロトタイプを渡します
		ex(jp.example.Super);

		
		init(function(p0, p1, p2, p3) {
			// $super メソッドで、Super のコンストラクタを呼び出します。
			this.$super(p0, p1);

			this.propC = p2;
			this.propD = p3;
		});

		// 親プロトタイプで定義されているメソッドをオーバーライドします。
		// オーバーライドを明示する構文はありません。
		// this.$super() でオーバーライド元のメソッドを実行できます。
		def(function inspect() {
			console.log(this);
			return this.$super() + "\npropC = " + this.propC + "\npropD = " + this.propD;
		});

		// $$ オブジェクトに対しての def は、プロトタイプへの static なメソッド定義です。
		$$.def(function classMethodA() {
			return "classMethodA";
		});
		// 同じく、プロトタイプへの static な変数定義です。
		$$.classVarA = "class variable";
	});

	// singleton メソッドは、ランタイムで１つしかインスタンス化できないプロトタイプを定義します。
	singleton(function Singleton() {
		init(function () {
			alert("Singleton was generated");
		});
	});

上記の例のように、プロトタイプの定義をそれぞれ１つのクロージャにくるむことで、
そのプロトタイプの定義をより明示的に行えることを目的としたフレームワークです。  
またプロトタイプ定義のコアとなっている Namespace オブジェクトは、
`new Namespace("jp.example")`としてインスタンス化された時、
jp, jp.example という JavaScript オブジェクトを自動で作ります。  
つまり`new Namespace("jp.example")`と`jp.example`は等価です。

### その他 ###
冒頭で挙げたその他の機能は上記の記法で書かれたライブラリです。
.js ファイルに適宜コメントを入れておりドキュメントもコミットしていますので、
興味のある方はご参照ください。

ライセンス
----------
Copyright &copy; 2013 Satoshi Takano  
Distributed under the [MIT License][mit].  

[Apache]: http://www.apache.org/licenses/LICENSE-2.0
[MIT]: http://www.opensource.org/licenses/mit-license.php
[GPL]: http://www.gnu.org/licenses/gpl.html
