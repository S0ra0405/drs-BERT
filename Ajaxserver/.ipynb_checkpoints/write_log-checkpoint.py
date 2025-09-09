import json
import pandas as pd
import csv
from datetime import datetime

file_path = "../data/editlog.tsv"
# def create_graph_log(text):


def write_edit_log(text):
    data = json.loads(text)
    timestamp = datetime.now().isoformat(timespec='seconds')
    for i in range(len(data['nodes'])):
        node_color = data['nodes'][str(i+1)]['color']
        if(node_color == "#EF476F" or node_color == "#F8A0A3"):
            data['nodes'][str(i+1)]['color'] = "claim"
        elif(node_color == "#454A49" or node_color == "#A0A7A5"):
            data['nodes'][str(i+1)]['color'] = "undefine"
        else:
            data['nodes'][str(i+1)]['color'] = "ground"


    # JSONを文字列化して1行のTSVにする
    log_entry = {
        'edit': json.dumps(data['step'],ensure_ascii=False),
        'timestamp': timestamp,
        'title': json.dumps(data['title'],ensure_ascii=False),
        'edges': json.dumps(data['edges'], ensure_ascii=False),
        'nodes': json.dumps(data['nodes'], ensure_ascii=False)
    }
    # print(log_entry)

    df = pd.DataFrame([log_entry])
    # ヘッダーがなければ書き込み、あれば追記
    try:
        with open(file_path, 'x', encoding='utf-8') as f:
            df.to_csv(f, sep='\t', index=False, quoting=csv.QUOTE_NONE, escapechar='\\')
    except FileExistsError:
        df.to_csv(file_path, mode='a', sep='\t', header=False, index=False, quoting=csv.QUOTE_NONE, escapechar='\\')

    print(f"ログ追記: {timestamp}")

if __name__ == '__main__':
    write_log("タイトルA",'{"edges": ["1-2", "2-3"], "nodes": {"1": {"color": "#EF476F", "label": "1. テキスト１"}, "2": {"color": "#454A49", "label": "2. テキスト２"}, "3": {"color": "#454A49", "label": "3. テキスト３"}}}')
