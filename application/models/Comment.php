<?php
/*
    comment---------
    from_user_id
    to_user_id
    rating
    content
    time
*/
class Comment extends Model {
    public static $_table_name = 'comments';
    public static $_priary_key = 'id';
    public static function ajax($data){
        if ($data['func'] == 'display') {
            $number_per_page = 5;
            $to_user_id = $data['user_id'];
            $page = $data['page'];
            $start_number = $page * $number_per_page;
            
            $query = "
            SELECT *
            FROM (
                SELECT
                    `cm`.`id`, `cm`.`rating`, `cm`.`content`, `cm`.`time` AS `time`,
                    `u`.`firstname`, `u`.`lastname`, `u`.`id`
                FROM
                    `comments` AS `cm`
                INNER JOIN
                    `users` AS `u`
                ON
                    `cm`.`from_user_id` = `u`.`id`
                WHERE
                    `cm`.`to_user_id` = '%{$to_user_id}%'
            ) AS `a`
            ORDER BY
                `a`.`time` DESC
            LIMIT
                {$start_number}, {$number_per_page}
            ";
            $result = DB::run_query($query);
            return json_encode($result);
        }
        if ($data['func'] == 'make') {
            $data_array = array(
                'time' => $data['time'],
                'from_user_id' => $data['from'],
                'to_user_id' => $data['to'],
                'rating' => $data['rating'],
                'content' => $data['content']
            );
            $comment = new Comment();
            $comment->populate($data_array);
            $result = $comment->save();
            return json_encode(array('success' => $result ? 1:0,'data'=>$result));
        }
    }
}
?>