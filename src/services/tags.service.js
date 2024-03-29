import client from "@/client";

export function getTags({tags = null, types = null}){
  let params = {}
  if( tags ) params["tags"] = tags.join(",")
  if( types ) params["types"] = types.join(",")

  return client.get(`/tags`, {
    params: params
  })
}