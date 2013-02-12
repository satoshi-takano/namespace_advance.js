namespace.js
======================
JavaScriptオブジェクトのprototype定義をシンプルに構造化するための軽量ライブラリです。
RubyなどのクラスベースOOP言語に慣れ親しんだプログラマにとって、書きやすく読みやすい記述方法の提案を目的としています。

###導入のメリットと制約###

`new Namespace("jp.example")`で得たNamespaceインスタンスに対し、下記で説明するNamespaceのメソッド群を使用して１つまたは複数のprototypeを定義します。  
namespace.jsでのprototype定義は、すべてNamespaceオブジェクトのメソッドを通して行われます。  
これによって、継承、メソッドのオーバーライドと親への委譲、クラスベースOOPでいうところのクラスメンバなどがシンプルかつ明示的に実装できます。    

Namespaceの定義された.jsファイルは、非同期かつ再帰的に読み込み可能なので、namespace.jsを利用して定義したprototypeは再利用しやすくなります。

制約としてNamespaceの名前とディレクトリの構成、jsファイル名を対応させる必要があります。
jp.example.my_prototypesというNamespaceを利用する場合、
その実装は /jp/example/my_prototypes.js に定義してください。  
この後で説明するように、この制約のおかげでnamespace.jsは依存するNamespaceをスマートに読み込むことができます。

それでは、namespace.jsを利用した実際のprototype定義方法を下記に例を示していきます。


### prototype定義の例 ###
	// プロトタイプの定義はすべて Namaspaceオブジェクトの
	// use メソッドに渡されるクロージャ内で行います。
	// ここでは jp.example というNamespaceを新しく作り、そこにprototypeを定義してみます。
    new Namespace("jp.example").use(function() {
    
    // Namespaceに定義された proto メソッドで 新たにprototype を定義します。
    // Namespace#use に渡した関数スコープの中では、一時的に Namespace#proto がグローバルオブジェクトにコピーされるため this.proto() ではなく単に proto() と書くことができます。
	proto(function Super() {
		// init に渡した無名関数（名前付きでも問題はありませんが、その名前は無視されます）
		// はコンストラクタの役割を果たし、インスタンス化される際に自動的に実行されます。
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
		// ex メソッドに継承元のprototypeを渡します
		ex(jp.example.Super);

		
		init(function(p0, p1, p2, p3) {
			// $super メソッドで、Super のコンストラクタを呼び出します。
			this.$super(p0, p1);

			this.propC = p2;
			this.propD = p3;
		});

		// 親プロトタイプで定義されているメソッドをオーバーライドします。
		// オーバーライドを機能はありません。
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
	// Singleton.getInstance() でインスタンスを得ます。
	singleton(function Singleton() {
		init(function () {
			alert("Singleton was generated");
		});
	});

`new Namespace(name)`の呼び出しによって同名のNamespaceが複数インスタンス化されることはありません。
つまり`new Namespace("jp.example") === new Namespace("jp.example")`は常に真になります。  
さらに`new Namespace("jp.example")`を実行した後は、グローバルオブジェクトに対し`window.jp.example`のようにアクセスでき、`new Namespace("jp.example") === window.jp.example`は常に真になります。  

上の例のコメントに示したように、Namespaceインスタンスに対してのprototype定義用のメソッドは、Namespace#use に渡した関数スコープの中で一時的にグローバルオブジェクトにコピーされるため、メソッド呼び出し時の this を省略でき視覚的にシンプルになります。  
このトリックは数箇所で使われていて、例えばNamespace#proto に渡した関数スコープ内では、prototypeに対してのメソッド定義用の Namespace#def メソッドが同じように一時的にグローバルオブジェクトにコピーされます。

namespace.jsを読み込んだ時点で、foundation というNamespaceインスタンスが存在します。  
このNamespaceには、Mainというsingletonなprototypeが定義されており、Main#mainメソッドがエントリーポイントになります。

### 依存するNamespaceの読み込み例 ###
ここでは、Canvasを利用したグラフィック描画に関しての機能を提供するライブラリの実装を仮定して、
/js/advanced/graphics/canvas.js に、`new Namespace("advanced.graphics.canvas")`インスタンスの実装をし、クライアントからの利用方法を説明します。
せっかくなので、このライブラリの中ではさらに /js/advanced/geometry.js に定義された advanced.geometry というNamespaceに依存していることを仮定し、依存関係を再帰的に解決することも示します。  

下記のようなファイル構造を仮定します。

    ├── css
    ├── images
    ├── index.html
    └── js
        └── advanced
            ├── geometry.js
            └── graphics
                └── canvas.js
まずは /js/advanced/graphics/canvas.js の中身をご覧ください。

    // /js/advanced/geometry.js に定義された advanced.geometry というNamespaceに依存していると仮定し、requireします。
    // 非同期に /js/advanced/geometry.jsを読み込み完了した時に Namespace#require 第二引数のコールバックが実行されます。コールバック内ではprototype定義の例で示したことと同じ要領でprototypeを定義します。
    new Namespace("advanced.graphics.canvas").require(["advanced.geometry"], function() {
    	this.use(function() {
    	
    		// advanced.graphics.canvas に Sprite を定義
    		proto(function Sprite() {
    			def(function draw() {
    				// 描画します。
    			})
    		})
    		
    	})
    })
    

次にこうして実装したprototypeを外から利用する方法を示します。
/index.html の script タグ内への記述を仮定します。  
 

	<script type="text/javascript">
	
	// jsファイルのディレクトリパスを指定
    // Namespace.jsPath = "./js";
    
	// /advanced/graphics/canvas.js の読み込みを要求。
	new Namespace("hoge").require(["advanced.graphics.canvas"], fucntion() {
		// 読み込み終わったらライブラリに定義したSpriteをインスタンス化
		var sprite = new advanced.graphics.canvas.Sprite();
	})
	
	</script>
    
上記の手順でprototypeの定義とその利用ができます。
クライアント側では`advanced.graphics.canvas`をrequireしただけですが、
`advanced.graphics.canvas`が依存している`advanced.geometry`も読み込まれています。
依存先のNamespaceが他のどんなNamespaceに依存していても、利用するときにそれを意識する必要はありません。



ライセンス
----------
Copyright &copy; 2013 Satoshi Takano  
Distributed under the [MIT License][mit].  

[Apache]: http://www.apache.org/licenses/LICENSE-2.0
[MIT]: http://www.opensource.org/licenses/mit-license.php
[GPL]: http://www.gnu.org/licenses/gpl.html
