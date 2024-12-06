import React, { useState, useEffect } from 'react';

    function BooksApi () {
        const [books , setBooks] = useState(null);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null)

        const fetchBook = async () => {
            try {
                setLoading(true);
                const response = await fetch("https://api.freeapi.app/api/v1/public/books")
                const result = await response.json();
                if (result.success) {
                    const randomBook = result.data.data[
                        Math.floor(Math.random() * result.data.data.length)
                    ];
                    setBooks(randomBook);
                } else {
                    setError(result.message || "Failed to fetch joke")
                }
            } catch (error) {
                setError("An error occurred while fetching joke");
            } finally {
                setLoading(false);
            }
        };

        useEffect(() => {
            fetchBook()
        }, []);
      //  console.log(books);
        

        if (loading) return <div>Loading...</div>
        if (error) return  <div>Error : {error}</div>;

        return (
            <div>
               
        {books && (
          <div>
          <h2 className='mb-3 text-2xl'>Book Name :<span className='text-yellow-300 '> {books.volumeInfo.title}</span></h2>
          <h4 className='mr-15 text-1xl mb-4'>Subtitle : {books.volumeInfo.subtitle || "soory no subtitle😔 "}</h4>
         <img src={books.volumeInfo.imageLinks.thumbnail} alt="book phota" className=' w-1/2 h-full justify-center ml-12 mb-3' />
           <p className='flex  m-2 ml-10'>Authors : {books.volumeInfo.authors}</p>
              <a href={books.accessInfo.webReaderLink} target='_blank' className='flex ml-10 text-3xl text-pink-200 underline hover:underline-offset-4'>Reading Book</a>
              <div>
               <p className='flex  m-2 ml-10'>PageCount:-{books.volumeInfo.pageCount}</p>
               <p className='flex  m-2 ml-10'>AverageRating:-{books.volumeInfo.averageRating}⭐</p>
               <a className='flex  mb-5 ml-10 rounded-md border-solid border-red-700 underline hover:underline-offset-4 ' href={books.saleInfo.buyLink} target='_blank'>Buy Book🔖</a>
              </div>
                    </div>
                
                )}
                <button onClick={fetchBook} className='flex  m-2 ml-10'>New Book</button>
            </div>
        )
    }

    export default BooksApi