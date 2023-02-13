def treenode(paths):
    l = []
    l2 = []
    for path in paths:
        pathlist = path.split('/')
        for i in range(len(pathlist)):
            pathdict = {}
            lpath = '0/'+'/'.join(pathlist[:i+1])
            lname = pathlist[i]
            pathdict['key'] = lpath
            pathdict['title'] = lname
            pathdict['isLeaf'] = False
            pathdict['parent_key'] = '0/'+'/'.join(pathlist[:i])
            if str(pathdict) not in l2:
                l.append((pathdict))
                l2.append(str(pathdict))
    return l


def arr2tree(source, parent):
    tree = []
    for item in source:
        if item["parent_key"] == parent:
            if not item['isLeaf']:
                item["children"] = arr2tree(source, item["key"])
            tree.append(item)
    return tree


def getTree(paths):
    l = treenode(paths)
    result = arr2tree(l, '0/')
    return result
