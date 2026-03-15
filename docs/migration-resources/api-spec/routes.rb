Rails.application.routes.draw do
  mount RailsAdmin::Engine => '/admin', as: 'rails_admin'
  mount LetterOpenerWeb::Engine, at: '/letter_opener' if Rails.env.development?

  # Rails単体アプリケーション時のルーティング
  # rails_admin使用時はノーマルのdeviseを利用してログインする必要がある
  root 'static_pages#home'
  get 'home', to: 'static_pages#home', as: 'home'
  get 'help', to: 'static_pages#help', as: 'help'
  get 'about', to: 'static_pages#about', as: 'about'
  devise_for :users, path: 'users', module: 'users'
  devise_scope :user do
    post 'users/guest_sign_in', to: 'users/sessions#guest_sign_in'
  end
  scope module: 'users' do
    resources :users, only: [:show] do
      collection do
        get 'home', to: 'users#home'
      end
      member do
        get 'following', to: 'users#following'
      end
    end
  end
  resources :roasters do
    collection do
      get 'home'
      get 'cancel'
    end
    member { get 'followers' }
  end
  resources :beans do
    resources :offers, only: [:new]
  end
  resources :offers do
    collection { get 'search' }
    member do
      get 'wanted_users'
    end
    resources :wants, only: %i[create]
    resources :likes, only: %i[create]
  end
  resources :roaster_relationships, only: %i[create destroy]
  resources :wants, only: %i[index show destroy] do
    collection { get 'search' }
    member do
      patch 'receipt', to: 'wants#receipt'
      patch 'rate', to: 'wants#rate'
    end
  end
  resources :likes, only: %i[index destroy] do
    collection { get 'search' }
  end
  resources :searches, only: %i[index] do
    collection do
      get 'roaster'
      get 'offer'
    end
  end

  # APIとしてのルーティング
  namespace :api do
    get '/health_check', to: 'health_check#index'
    get '/test', to: 'test#index'
    namespace :v1 do
      mount_devise_token_auth_for 'User', at: 'auth', controllers: {
        # registrationsのパスを'devise_token_auth/registrations' -> 'api/v1/auth/registrations'に上書き
        registrations: 'api/v1/auth/registrations',
        # registrationsのパスを'devise_token_auth/sessions' -> 'api/v1/auth/sessions'に上書き
        sessions: 'api/v1/auth/sessions',
      }

      # deciseのcontrollerにルーティングを追加
      devise_scope :user do
        get 'auth/sessions/', to: 'auth/sessions#index'
      end

      resources :users, only: [:show] do
        collection do
          get 'current_offers', to: 'users#current_offers' # api/v1/users/current_offers
        end
        member do
          get 'roasters_followed_by_user', to: 'users#roasters_followed_by_user' # api/v1/users/#{id}/roasters_followed_by_user
        end
      end

      resources :roasters, only: %i[show create update destroy] do
        member do
          get 'followers'
          get 'offers'
        end
      end

      resources :roaster_relationships, only: %i[index create destroy]

      resources :beans, only: %i[index show create update destroy]

      resources :offers, only: %i[index show create update destroy] do
        collection do
          get 'recommend'
          get 'stats'
        end
        member { get 'wanted_users' }
      end

      resources :wants, only: %i[index show create destroy] do
        collection { get 'stats' }
        member do
          patch 'receipt'
          patch 'rate'
        end
      end

      resources :likes, only: %i[index create destroy]

      # serach_controller.rbへのルーティング
      get 'search/roasters', to: 'search#roasters'
      get 'search/offers', to: 'search#offers'
    end
  end
end
