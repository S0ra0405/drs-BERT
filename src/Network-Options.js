function getBaseNetworkOption(height, width, node_maxheight, node_maxwidth){
    let network_options = {
        "autoResize": true,
        "height": height,
        "width": width,
        "layout": {
            "hierarchical": {
                "enabled": true,
                "direction": "UD",
                "sortMethod": "directed",
                "levelSeparation": node_maxheight + 20,
                //"levelSeparation": 100,
                "nodeSpacing": node_maxwidth
            }
        },
        "edges": {
            "font": {
                "size": 16
            },
            "widthConstraint": {
                "maximum": node_maxwidth
            },
            "color": { color: '#76eec6' },
            "arrows": {
                    "to": {
                    "enabled": true,
                    "type": 'arrow'
                    }
            },
            "smooth": {
                "enabled": false
            }
        },
        "nodes": {
            "shape": 'box',
            "widthConstraint": {
                "maximum": node_maxwidth
            },
            "color": {
                "highlight": {
                    "background": '#575f5d'
                }
            }
        },
        "physics": {
            "enabled": true,
            "hierarchicalRepulsion": {
                "centralGravity": 0.0,
                "springLength": 500,
                "springConstant": 0.01,

                "nodeDistance": 50,
                "springLength": 150,
                "damping": 1.0
            },
            "repulsion": {
                "damping": 1.0
            }
        },
        "manipulation": {
            "enabled": false,
            addEdge: function (data, callback) {
                AddEdgeFunc(data, callback);
            }
        }
    };
    return network_options;
}