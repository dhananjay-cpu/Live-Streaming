Rails.application.routes.draw do
  root 'pages#home'
  get 'channels', to: 'streams#index', as: 'channels'
  get 'channel/start', to: 'streams#start', as: 'channel/start'
  get 'channel/:id', to: 'streams#show', as: 'channel'
  post '/streams/start', to: 'streams#start'

  

  devise_for :users, controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations'
  }

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
end
