from bs4 import BeautifulSoup
import requests
import wget
import re
import random
import pymongo

client = pymongo.MongoClient('mongodb://localhost:27017/') # connection to mongo

db = client.bookstore
collection = db['books_test']


for i in range(160, 220):
    response =  requests.get(f"http://www.laguna.rs/n{i}_.html")
    if(response.status_code != 200):
        print(f"skipping n_{i}, status_code={response.status_code}")
        continue
    soup = BeautifulSoup(response.text, 'html.parser')

    book_data = soup.find(class_='row hidden-sm hidden-xs podaci')

    try:
        title = book_data.h1.get_text()
    except:
        print(f"skipping n_{i}, no data")
        continue
    
    author = None
    if(book_data.h2.a is not None):
        author = book_data.h2.a.get_text()
    else:
        author = "Grupa autora"
    category = soup.find_all(class_='podatak')[-1].h3.a.get_text() # should get first category


    cover_src = soup.find(id='korica_v')['src']
    descr = soup.find(id='oknjizitab').get_text()
    try:
        price = int(re.search(r"\d+", soup.find(id='cena').p.get_text()).group(0)) # should get price before decimal point
    except:
        price = random.randrange(200, 1200, 10)

    # img_file = wget.download(f"http://www.laguna.rs/{cover_src}", f"../frontend/public/book_covers/{title}-{author}.jpg")

    book = {
        "title": title,
        "author": author,
        "book_cover": f"/book_covers/{title}-{author}.jpg",
        "category": category,
        "decription": descr,
        "price": price,
    }

    print('adding ', book['title'])
    print(title, author, cover_src, category, price)
    collection.insert_one(book)     # inserting book into our database
    
