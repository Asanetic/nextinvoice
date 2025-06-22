import { mosyCountRows, mosySqlInsert } from "../apiUtils/dataControl/dataUtils";

export async function addInventoryItem(req, newItemId)
{

    const sentItemId  = req.txt_item_id
    const itemName = req.txt__inventory_item_name_item_id

    const checkItemName = await mosyCountRows("inventory",`where record_id='${sentItemId}' and item_name='${itemName}'`)

    console.log(`addInventoryItem`, req , newItemId, ` d;l;dlf `, checkItemName)

    if(Number(checkItemName)==0)
    {
      const ProductandservicesInputsArr = {
        "item_name" : req.txt__inventory_item_name_item_id, 
        "quantity" : "?", 
        "rate" : "?", 
        "tax" : "?", 
        "discount" : "?", 
        "date_created" : "?", 
        "item_remark" : "?", 
        "hive_site_id" : "?", 
        "hive_site_name" : "?", 
      
      };
      
      //--- End inventory inputs array --//
            ProductandservicesInputsArr.record_id = newItemId;
            
            // Insert into table Productandservices
            const result = await mosySqlInsert("inventory", ProductandservicesInputsArr, req);

            console.log(`addInventoryItem __ `, result )
              
            return Response.json({
              status: 'success',
              message: result.message,
              inventory_uptoken: result.record_id
            });
            
    }
}