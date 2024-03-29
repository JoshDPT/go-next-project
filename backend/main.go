package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/gobwas/ws"
	"github.com/gobwas/ws/wsutil"
	"log"
	"net/http"
	"sync"
)

type Document struct {
	Title string `json:"title"`
	Body  string `json:"body"`
}

var document = Document{
	Title: "Pot of Gold",
	Body:  "100",
} //TODO HACK: only one document for now
var documentMutex sync.Mutex
var documentCond = sync.NewCond(&documentMutex)

func main() {
	handler := http.HandlerFunc(func(rw http.ResponseWriter, req *http.Request) {
		// switch cases based on the url path - endpoint
		switch req.URL.Path {
		// case for grabbing the initial data from getServerSideProps Next 12
		case "/handler-initial-data":
			var documentBytes bytes.Buffer
			err := json.NewEncoder(&documentBytes).Encode(&document)
			if err != nil {
				log.Println("Error encoding document: ", err)
				return
			}
			rw.Header().Set("Content-Type", "application/json")
			rw.Header().Set("Content-Length", fmt.Sprint(documentBytes.Len()))
			rw.Write(documentBytes.Bytes())

			// case for the WEBSOCKETS
		case "/handler":
			// if it is a WEBSOCKET, we need to upgrate it from std HTTP to a WEBSOCKET connection
			conn, _, _, err := ws.UpgradeHTTP(req, rw)
			if err != nil {
				log.Println("Error with WebSocket: ", err)
				rw.WriteHeader(http.StatusMethodNotAllowed)
				return
			}
			go func() {
				defer conn.Close()
		
				for { //send the document to the frontend when it changes
					documentMutex.Lock()
					documentCond.Wait()
					documentMutex.Unlock()
		
					var documentBytes bytes.Buffer
					err := json.NewEncoder(&documentBytes).Encode(&document)
					if err != nil {
						log.Println("Error encoding document: ", err)
						return
					}
		
					err = wsutil.WriteServerMessage(conn, ws.OpText, documentBytes.Bytes())
					if err != nil {
						log.Println("Error writing WebSocket data: ", err)
						return
					}
				}
			}()
			go func() {
				for { //the client is asking to change the document
					defer conn.Close()
		
					data, err := wsutil.ReadClientText(conn)
					if err != nil {
						log.Println("Error encoding document: ", err)
						return
					}
		
					documentMutex.Lock()
					err = json.Unmarshal(data, &document)
					if err != nil {
						documentMutex.Unlock()
						log.Println("Error unmarshalling document: ", err)
						return
					}
					documentCond.Broadcast()
					documentMutex.Unlock()
				}
			}()
		
		default:
			rw.WriteHeader(http.StatusNotFound)
		}
	})

	log.Println("Server is available at http://localhost:8000")
	log.Fatal(http.ListenAndServe(":8000", handler))
}