require 'sinatra'
require 'sinatra/reloader'
require 'active_record'

Time.zone_default = Time.find_zone! 'Tokyo'
ActiveRecord::Base.default_timezone = :local

ActiveRecord::Base.establish_connection(
    "adapter" => "sqlite3",
    "database" => "./main.db"
)

class Task < ActiveRecord::Base
end

get '/' do
    erb :index
end

get '/all' do
    Task.all.to_json
end

post '/add' do
    new_task = JSON.parse(request.body.read)
    logger.info "body: #{new_task['body']}"
    task = Task.create(body: new_task['body'], done: false)
    task.to_json
end

post '/update' do
    update_task = JSON.parse(request.body.read)
    logger.info "id: #{update_task['id']} done: #{update_task['done']}"
    Task.update(update_task['id'], done: update_task['done'])
end

post '/delete/done' do
    Task.where(done: true).delete_all
end
