import { Client, Databases, ID, Query } from "appwrite";

const dataBaseId = import.meta.env.VITE_DATABASE_ID;
const collectionId = import.meta.env.VITE_COLLECTION_ID;
const appwriteId = import.meta.env.VITE_APPWRITE_ID;

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(appwriteId);

const database = new Databases(client);

export const updateCount = async (searchTerm, movie) => {
  console.log("response");
  try {
    const result = await database.listDocuments(dataBaseId, collectionId, [
      Query.equal("searchterm", searchTerm),
    ]);
   console.log("response");
    if (result.documents.length > 0) {
      const doc = result.documents[0];

      await database.updateDocument(dataBaseId, collectionId, doc.$id, {
        count: (doc.count || 0) + 1,
      });
    } else {
      await database.createDocument(dataBaseId, collectionId, ID.unique(), {
        searchterm: searchTerm,
        count: 1,
        movie_id: movie.id,
        poster_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
      });
      console.log("response");
    }
  } catch (error) {
    console.error("Error updating count:", error);
  }

};

export const getTrending=async()=>{
  try {

    const Trending=await database.listDocuments(dataBaseId,collectionId,[
      Query.limit(5),
      Query.orderDesc("count"),
    ])
    return Trending.documents;
  } catch (error) {
    console.error("Error in getting Trending movies");
  }
};

