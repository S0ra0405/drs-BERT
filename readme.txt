■ 構成
■ ソフトウェア
nodejs (https://nodejs.org/en/)
python (https://www.python.org)
MeCab (https://taku910.github.io/mecab/)
■ インストール方法
  1. MeCabは IPADIC を UTF-8 で作成する．
  2. Pythonのインストール
  3. Pythonのパッケージ構成
    python -m pip install --upgrade pip
    pip install flask
    pip install flask_cors
    pip install pandas
    pip install numpy
    pip install pprint
    pip install MeCab
    pip install ipadic
    pip install scipy
    pip install gensim==3.8.3
    pip install scikit-learn==0.22.2.post1
    pip install joblib
    pip install Fugashi
    pip install torch
    pip install transformer
  4. nodejsのインストール
  5. nodejsのパッケージ構成
    npm install -g http-server
■ 起動方法
  1. server側 (port 5000)
  cd Ajaxserver
  python network-interface.py
  2. client側 (port 8080)
  cd src
  http-server
  3. ブラウザで開く
<<<<<<< HEAD
  http://localhost:8080/interface.html
=======
  http://localhost:8080/interface.html
>>>>>>> 58ca7b5 (MaC)
