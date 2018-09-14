import csv
import json

def clean_data():
    article_map = {}
    tag_map = {}
    name_to_id_map = {}

    with open('raw_articles.csv', mode='r') as f:
        reader = csv.DictReader(f)
        article_id = 0
        for row in reader:
            article_data = {
                'title': row['title'],
                'url': row['url'],
                'author': row['author'],
                'excerpt': row['excerpt'],
                'img_url': row['img'],
            }
            article_map[article_id] = article_data
            name_to_id_map[row['title']] = article_id
            article_id += 1


    with open('raw_tags.json') as f:
        data = json.load(f)
        for blob in data:
            tag = blob['tag']
            article_id_list = []
            for a in blob['articles']:
                article_id = name_to_id_map[a['title']]
                article_id_list.append(str(article_id))
            tag_map[tag] = article_id_list

    all_data = {"articles": article_map, "tags": tag_map}

    with open('cleaned_data.json', 'w') as f:
        json.dump(all_data, f, ensure_ascii=True)


if __name__ == '__main__':
    clean_data()
