points_matrix =
/**３対比 */
                    [[[100,0,0,100],
                    [0,100,100,0],
                    [0,100,100,0],
                    [100,0,0,100],
                  ]];

arr_labels = ["Sample1","Sample2","Sample3","Sample4"];

contents = ["ground","ground","ground","claim"]

matrix_label = [];

/**let parag_len = arr_labels.length;
 */

main_network = undefined;
network_arr = {};
nodes = {};
edges = {};

network_options = {};
var node_maxwidth = 250;
var node_maxheight = 90;

var flex_threshold_range = [53, 56];
var flex_threshold_gap = 1;
var numberthres = (flex_threshold_range[0]+flex_threshold_range[1])/2;

function make_nodes(parag_len, labels, cont){
  //////console.log(parag_len, labels)
    var arr_nodes = new Array();
    for(let i=0; i<parag_len; i++){
        ////console.log(labels[i]);
        if(cont[i] == "claim"){
          border_color = '#EF476F';
          highlight_color = '#F8A0A3';
        }else if(cont[i] == "noattr"){
          border_color = '#454A49';
          highlight_color = '#A0A7A5';
        }else{
          border_color = '#76eec6';
          highlight_color = '#9AFDE8';
        }
        arr_nodes.push({
            "id": i+1,
            "label": labels[i],
            "font": {color:'#ffffff'},
            "color": {background: '#575f5d',
                    "border": border_color,
                    "highlight": {
                      "border": highlight_color
                    }
            },
        });
    }
    //console.log(new vis.DataSet(arr_nodes));
    return new vis.DataSet(arr_nodes);
}

function make_edges(matrix, thres){
  if(typeof matrix == "number"){return [];}
  ////console.log(matrix, thres);
  parag_len = matrix.length;
  var arr_edges = new Array();
  for(let i=0; i<parag_len; i++){
    let edgecount = 0;
    for(let j=i+1; j<parag_len; j++){
      if(matrix[i][j] >= thres){
        ////console.log("edges "+i+j);
        arr_edges.push({
          "id": (Number(i)+1)+"-"+(Number(j)+1),
          "from": i+1, 
          "to": j+1, 
          "label": String(matrix[i][j]),
          "font": {size: 16},
          "color": '#738080',
          "arrows": {
            "to":{
              "enabled": true,
              "type": 'arrow'
            }
          }
        });
        edgecount++;
      }
      if(edgecount>1){break;}
    }
  }
  //console.log(new vis.DataSet(arr_edges));
  return new vis.DataSet(arr_edges);
}

function concutArrays(array){
  base = [];
  if(Array.isArray(array)){
    for(let a=0; a<array.length; a++){
      base = base.concat(array[a]);
    }
    return base;
  }else{
    //console.log(array+"is not array");
  }
}

function sortNum(array){
  if(Array.isArray(array)){
    return array.sort(function (a, b) {
      return a - b;
    });
  }else{
    //console.log(array+"is not array");
  }
}

function makeThresholdArray(matrix_, thres_){
  /**最小ライン以上の点数を閾値に採用する*/
  matrix_ = concutArrays(matrix_);
  thres_arr = Array.from(new Set(matrix_));
  thres_arr = thres_arr.filter(x => x>=thres_);
  if(thres_arr.length > 0){
    thres_arr = sortNum(thres_arr);
  }else{
    makeThresholdArray(matrix_, thres_-1);
  }

  return thres_arr; /**閾値の配列 */
}

function makeEdgebyThresArr(matrix_arr, thres_, mat_label){
  /**枝分けされた点数*採用した閾値のエッジ */
  let edges_buf = [];
  let labels_buf = [];
  ////console.log(matrix_arr);
  ////console.log(mat_label);
  for(let i=0; i<matrix_arr.length; i++){
    ////console.log(i);
    thres_arr = makeThresholdArray(matrix_arr[i], thres_);
    let edge_buf = [];
    let label_buf = [];
    for(let t=0; t<thres_arr.length; t++){
      let edges = make_edges(matrix_arr[i], thres_arr[t]);
      edge_buf.push(edges);
      label_buf.push(mat_label[i]+String(thres_arr[t]));
    }
    edges_buf.push(edge_buf);
    labels_buf.push(label_buf);
  }
  edgedatas = {edges: edges_buf, labels: labels_buf}
  //console.log(edgedatas);
  return edgedatas; /**エッジの2次元配列 */
}

function SimpleRanking(edges_arr){
  //console.log(edges_arr);
  let rank_arr = [];
  for(let i=0; i<edges_arr.length; i++){
    edges = edges_arr[i];
    let rank = [];
    //console.log(i);
    for(let j=0; j<edges.length; j++){
      //console.log(j);
      if(j == 0){
        rank.push(10);
      }else{
        rank.push(0);
      }
    }
    rank_arr.push(rank);
  }
  //console.log(rank_arr);
  return rank_arr; /**候補の優先度の2次元配列 */
}

function make_datas(labels_, matrix_arr, thres_, cont, mat_label){
  let nodes = make_nodes(labels_.length, labels_, cont); /** 文の中身. 共通 */
  let edgedatas = makeEdgebyThresArr(matrix_arr, thres_, mat_label); /** 枝分けされた点数*採用した閾値 */
  let edges = edgedatas.edges;
  let labels = edgedatas.labels;
  let ranks = SimpleRanking(edgedatas.edges); /**候補の優先度 */

  //console.log(edges);
  edges = concutArrays(edges);
  labels = concutArrays(labels);
  ranks = concutArrays(ranks);

  datas = [];
  //console.log(edges);
  for(let i=0; i<edges.length; i++){
    datas.push(
      {
        "nodes": nodes,
        "edges": edges[i],
        "ranks": ranks[i],
        "mat_labels": labels[i]
      }
    );
  }

  return datas;
}

class ExpandingDiv extends HTMLDivElement{
  constructor() {
    super();
    this.setAttribute('class','network');
    this.setAttribute('draggable','false');
    this.setAttribute('ondragstart','drag(event)');
    this.setAttribute('ondragover','allowDrop(event)');
    this.setAttribute('ondrop','drop(event)');
  }
}customElements.define('expanding-div', ExpandingDiv, { extends: 'div' });

var selectedEdgeId = {};
function act_mynetwork(labels_, matrix_, thres_, mat_label_, threshold_range, content_){
  ////console.log(matrix_);
  //console.log(make_datas(labels_, matrix_, thres_, content_, mat_label_));

  resetNetworkEvents();
  deleted_network = {};
  
  $('#network-array').addClass('active');
  $('#network-array-button').addClass('active');
  var maincontainer = document.getElementById('mynetwork');
  var container_boxarr = document.getElementById('network-array');

  //maincontainer.setAttribute('ondragover','allowDrop(event)');
  //maincontainer.setAttribute('ondrop','drop(event)');

  datas = make_datas(labels_, matrix_, thres_, content_, mat_label_);
  datas.sort(function (a, b) {
    return b.ranks - a.ranks;
  });
  //console.log(datas);

  for(let d=0; d<datas.length; d++){
    if(d == 0){
      main_network = visNetwork(datas[d], maincontainer, '100%', '100%');
      disableHierarchy(main_network);
      eventEdgeDblclicled(main_network);
    }else{
      var el = document.createElement('div', {is : 'expanding-div'});
      elid = datas[d].mat_labels;
      el.setAttribute("id", elid);
      let network = visNetwork(datas[d], el, '100%', '100%');
     disableHierarchy(network);
     container_boxarr.appendChild(el);
     network_arr[elid] = network;
     eventEdgeDblclicled(network);
    }
  }
  //NetworkContext();
  disableHierarchy(main_network);
  eventEdgeDblclicled(main_network);
  NetworkContext();
  deleteEdgeAction();
  editEdgeMode();
  Submit_EditedNetwork()
}

function visNetwork(datas, container, height, width) {
  let data = {
    "nodes": datas.nodes,
    "edges": datas.edges
  };
  network_options = getBaseNetworkOption(height, width, node_maxheight, node_maxwidth)
  ////console.log(Array.from({length: parag_len}, (v, i) => i+1));
  return new vis.Network(container, data, network_options);
}

function disableHierarchy(network){
  network.on('startStabilizing', function(e){
    network.setOptions({
      "layout":{
        "hierarchical": false
      },
      "physics":{
        "enabled": false
      }
    });
  });
}

function resetNetworkEvents(){
  $('#delete-button').off('click',);
  $('#edit-button').off('click',);
  $('#download').off('click',);
}

function appendSentences(sentences){
  let parent_container = document.getElementById('sentences-array');
  for(let inner in sentences){
    let nodeId = parseInt(inner, 10)+1;
    var el = document.createElement('button');
    el.setAttribute('class', 'text_display_child');
    el.setAttribute('id', nodeId);
    el.innerHTML = sentences[inner];
    parent_container.appendChild(el);
    $('#sentences-array > button').on('click', function(){
      ////console.log("_text_display_child clicked")
      let id = $(this).attr('id');
      ////console.log("text_display_child clicked"+id);
      $('#target').attr('value', id);
      main_network.selectNodes([id]);
    });
  }
}

/**HTMLの要素 子配列を初期化 */
function clearElements(elid){
  var element = document.getElementById(elid);
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}
/**HTMLの要素 任意の子を削除 */
function clearSingleElement(elid, index){
  var element = document.getElementById(elid);
  ////console.log(element.childNodes.item(index));
  if(element.childNodes.item(index)){
    element.removeChild(element.childNodes.item(index));
  }
}

//$('#network-array-button').on('click', function(){
//  //console.log('button click');
//  $('#network-array').toggleClass('active');
//  $('#network-array-button').toggleClass('active');
//});